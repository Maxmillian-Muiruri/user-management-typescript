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
  private users: User[] = [];
  private tasks: Task[] = [];

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

  updateUserById(id: number, name: string, email: string): boolean {
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
const newUser = usermanager.createUser(
  1,
  "peter njoroge",
  "peternjoroge@gmail.com",
  true
);

console.log(newUser.getUserInfo());

const updateUser = usermanager.createUser(
  2,
  "Maxmillin Muiruri",
  "maxmillianmuiruri@gmail.com",
  true
);

// update user
newUser.updateUser("john brian", "johnbrian@example.com");
console.log(newUser.getUserInfo());

// Delete the user
const deleted = usermanager.deleteUserById(2);
console.log("User deleted:", deleted);

const newTask = usermanager.createTask(
  1,
  "Complete Assignment",
  "Finish the TypeScript assignment by tomorrow."
);

// Assign task to user
usermanager.assignTaskToUser(1, 1);

// Get tasks for user
const tasksForAlice = usermanager.getTasksForUser(1);
console.log("Tasks for peter:", tasksForAlice);

// Unassign task
usermanager.unassignTask(1);
console.log(
  "Tasks for peter after unassigned:",
  usermanager.getTasksForUser(1)
);
//deletetask
const deletedTask = usermanager.deleteTaskById(1);
console.log("Task deleted:", deletedTask);
