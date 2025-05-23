interface IUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface ITask {
  id: number;
  title: string;
  description: string;
  assignedUserId?: number;
}

class User implements IUser {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public isActive: boolean
  ) {}

  getUserInfo(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isActive: this.isActive,
    };
  }
  updateUser(name: string, email: string): void {
    this.name = name;
    this.email = email;
  }
}

class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public assignedUserId?: number
  ) {}
}

class userManager {
  public users: User[] = [];
  public tasks: Task[] = [];

  createUser(id: number, name: string, email: string, isActive: boolean): User {
    const user = new User(id, name, email, isActive);
    this.users.push(user);
    return user;
  }

  createTask(id: number, title: string, description: string): Task {
    const task = new Task(id, title, description);
    this.tasks.push(task);
    return task;
  }

  assignTaskToUser(taskId: number, userId: number): boolean {
    const task = this.tasks.find((t) => t.id === taskId);
    const user = this.users.find((u) => u.id === userId);
    if (task && user) {
      task.assignedUserId = userId;
      return true;
    }
    return false;
  }

  unassignTask(taskId: number): boolean {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task && task.assignedUserId !== undefined) {
      task.assignedUserId = undefined;
      return true;
    }
    return false;
  }

  getTasksForUser(userId: number): Task[] {
    return this.tasks.filter((t) => t.assignedUserId === userId);
  }

  updateUserById(
    id: number,
    name: string,
    email: string,
    isActive: boolean
  ): boolean {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      user.updateUser(name, email);
      return true;
    }
    return false;
  }

  deleteUserById(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteTaskById(id: number): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }
}

const usermanager = new userManager();

function refreshUserList(): void {
  const container = document.getElementById("usersList") as HTMLElement;
  container.innerHTML = usermanager.users
    .map(
      (user) => `
        <div class="user-card">
          <h3>${user.name} (ID: ${user.id})</h3>
          <p>Email: ${user.email}</p>
          <p>Status: ${user.isActive ? "Active" : "Inactive"}</p>
        </div>`
    )
    .join("");
}

function refreshTaskList(): void {
  const container = document.getElementById("tasksList") as HTMLElement;
  container.innerHTML = usermanager.tasks
    .map(
      (task) => `
        <div class="task-card ${
          task.assignedUserId ? "assigned" : "unassigned"
        }">
          <h3>${task.title} (ID: ${task.id})</h3>
          <p>${task.description}</p>
          <p>${
            task.assignedUserId
              ? `Assigned to User ${task.assignedUserId}`
              : "Unassigned"
          }</p>
        </div>`
    )
    .join("");
}
// create user
function handleUserCreate(): void {
  const id = parseInt(
    (document.getElementById("userId") as HTMLInputElement).value
  );
  const name = (document.getElementById("userName") as HTMLInputElement).value;
  const email = (document.getElementById("userEmail") as HTMLInputElement)
    .value;
  const isActive = (document.getElementById("userActive") as HTMLInputElement)
    .checked;

  usermanager.createUser(id, name, email, isActive);
  refreshUserList();
}

// update user

function handleUserUpdate(): void {
  const id = parseInt(
    (document.getElementById("userId") as HTMLInputElement).value
  );
  const name = (document.getElementById("userName") as HTMLInputElement).value;
  const email = (document.getElementById("userEmail") as HTMLInputElement)
    .value;
  const isActive = (document.getElementById("userActive") as HTMLInputElement)
    .checked;
  usermanager.updateUserById(id, name, email, isActive);
  refreshUserList();
}

//delete user
function handleUserDelete(): void {
  const id = parseInt(
    (document.getElementById("userId") as HTMLInputElement).value
  );
  usermanager.deleteUserById(id);
  refreshUserList();
  refreshTaskList();
}

//task
/**
 * create task
 */
function handleTaskCreate(): void {
  const id = parseInt(
    (document.getElementById("taskId") as HTMLInputElement).value
  );
  const title = (document.getElementById("taskTitle") as HTMLInputElement)
    .value;
  const desc = (document.getElementById("taskDesc") as HTMLInputElement).value;
  usermanager.createTask(id, title, desc);
  refreshTaskList();
}
/**
 * delete task
 */
function handleTaskDelete(): void {
  const id = parseInt(
    (document.getElementById("taskId") as HTMLInputElement).value
  );
  usermanager.deleteTaskById(id);
  refreshTaskList();
}

/**
 *
 */
function handleAssignTask(): void {
  const taskId = parseInt(
    (document.getElementById("assignTaskId") as HTMLInputElement).value
  );
  const userId = parseInt(
    (document.getElementById("assignUserId") as HTMLInputElement).value
  );
  // if (!usermanager.assignTaskToUser(taskId, userId)) {
  //   alert("Task or User not found!");
  // }
  refreshTaskList();
}

function handleUnassignTask(): void {
  const taskId = parseInt(
    (document.getElementById("assignTaskId") as HTMLInputElement).value
  );
  usermanager.unassignTask(taskId);
  refreshTaskList();
}

document.addEventListener("DOMContentLoaded", () => {
  (document.getElementById("createUserBtn") as HTMLElement).addEventListener(
    "click",
    handleUserCreate
  );
  (document.getElementById("updateUserBtn") as HTMLElement).addEventListener(
    "click",

    handleUserUpdate
  );
  (document.getElementById("deleteUserBtn") as HTMLElement).addEventListener(
    "click",
    handleUserDelete
  );
  (document.getElementById("createTaskBtn") as HTMLElement).addEventListener(
    "click",
    handleTaskCreate
  );

  (document.getElementById("deleteTaskBtn") as HTMLElement).addEventListener(
    "click",
    handleTaskDelete
  );

  (document.getElementById("assignTaskBtn") as HTMLElement).addEventListener(
    "click",
    handleAssignTask
  );

  (document.getElementById("unassignTaskBtn") as HTMLElement).addEventListener(
    "click",
    handleUnassignTask
  );

  refreshUserList();
  refreshTaskList();
});

// const newUser = usermanager.createUser(
//   1,
//   "peter njoroge",
//   "peternjoroge@gmail.com",
//   true
// );
// const newUser2 = usermanager.createUser(
//   2,
//   "john paul",
//   "johnpaul@gmail.com",
//   true
// );

// console.log("createuser:", newUser.getUserInfo());
// console.log("createuser2:", newUser2.getUserInfo());

// usermanager.createUser(
//   2,
//   "Maxmillin Muiruri",
//   "maxmillianmuiruri@gmail.com",
//   true
// );

// // update user
// newUser.updateUser("john brian", "johnbrian@example.com");
// console.log("update user", newUser.getUserInfo());

// // Delete the user
// const deleted = usermanager.deleteUserById(2);
// console.log("User deleted:", deleted);

// const newTask = usermanager.createTask(
//   1,
//   "Complete Assignment",
//   "Finish the TypeScript assignment by tomorrow."
// );

// // Assign task to user
// usermanager.assignTaskToUser(1, 1);

// // Get tasks for user
// const tasksForAlice = usermanager.getTasksForUser(1);
// console.log("Tasks for peter:", tasksForAlice);

// // Unassign task
// usermanager.unassignTask(1);
// console.log(
//   "Tasks for peter after unassigned:",
//   usermanager.getTasksForUser(1)
// );
// //deletetask
// const deletedTask = usermanager.deleteTaskById(1);
// console.log("Task deleted:", deletedTask);
