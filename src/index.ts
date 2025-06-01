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

class UserManager {
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
      user.name = name;
      user.email = email;
      user.isActive = isActive;
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

const userManager = new UserManager();

// DOM Utility Functions
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Element with id ${id} not found`);
  return element as T;
}

// Render Functions
function renderUsers(users?: User[]): void {
  const usersToRender = users || userManager.users;
  const container = getElement<HTMLDivElement>("usersList");
  container.innerHTML = usersToRender
    .map(
      (user) => `
      <div class="user-card">
        <div class="user-id">#${user.id}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-email">${user.email}</div>
        </div>
        <div class="user-status ${
          user.isActive ? "status-active" : "status-inactive"
        }">
          ${user.isActive ? "Active" : "Inactive"}
        </div>
      </div>`
    )
    .join("");
}

function renderTasks(tasks?: Task[]): void {
  const tasksToRender = tasks || userManager.tasks;
  const container = getElement<HTMLDivElement>("tasksList");
  container.innerHTML = tasksToRender
    .map(
      (task) => `
      <div class="task-card ${task.assignedUserId ? "assigned" : "unassigned"}">
        <div class="task-id">#${task.id}</div>
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-desc">${task.description}</div>
          <div class="task-assignee">
            ${
              task.assignedUserId
                ? `<i class="fas fa-user-check"></i> Assigned to user #${task.assignedUserId}`
                : `<span class="no-assignee"><i class="fas fa-user-times"></i> Unassigned</span>`
            }
          </div>
        </div>
      </div>`
    )
    .join("");
}

function updateCounters(): void {
  const userCount = getElement<HTMLSpanElement>("userCount");
  const taskCount = getElement<HTMLSpanElement>("taskCount");
  userCount.textContent = userManager.users.length.toString();
  taskCount.textContent = userManager.tasks.length.toString();
}

function refreshAllData(): void {
  renderUsers();
  renderTasks();
  updateCounters();
}

// Search and Filter Functions
function filterUsers(searchTerm: string): void {
  const filtered = userManager.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
  );
  renderUsers(filtered);
}

function filterTasks(searchTerm: string): void {
  const filtered = userManager.tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toString().includes(searchTerm)
  );
  renderTasks(filtered);
}

function filterTasksByStatus(status: string): void {
  let filtered: Task[] = [];
  switch (status) {
    case "assigned":
      filtered = userManager.tasks.filter(
        (task) => task.assignedUserId !== undefined
      );
      break;
    case "unassigned":
      filtered = userManager.tasks.filter(
        (task) => task.assignedUserId === undefined
      );
      break;
    default:
      filtered = [...userManager.tasks];
  }
  renderTasks(filtered);
}

// Fullscreen Functionality
function toggleFullscreen(sectionClass: string): void {
  const section = document.querySelector(`.${sectionClass}`);
  if (!section) return;

  section.classList.toggle("fullscreen");
  const btn = document.getElementById(
    `${
      sectionClass === "user-management" ? "expandUsersBtn" : "expandTasksBtn"
    }`
  );
  const icon = btn?.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-expand");
    icon.classList.toggle("fa-compress");
  }
}

// Event Handlers
function handleUserCreate(): void {
  const id = parseInt(getElement<HTMLInputElement>("userId").value);
  const name = getElement<HTMLInputElement>("userName").value;
  const email = getElement<HTMLInputElement>("userEmail").value;
  const isActive = getElement<HTMLInputElement>("userActive").checked;

  userManager.createUser(id, name, email, isActive);
  refreshAllData();
}

function handleUserUpdate(): void {
  const id = parseInt(getElement<HTMLInputElement>("userId").value);
  const name = getElement<HTMLInputElement>("userName").value;
  const email = getElement<HTMLInputElement>("userEmail").value;
  const isActive = getElement<HTMLInputElement>("userActive").checked;

  if (userManager.updateUserById(id, name, email, isActive)) {
    refreshAllData();
  } else {
    alert("User not found!");
  }
}

function handleUserDelete(): void {
  const id = parseInt(getElement<HTMLInputElement>("userId").value);
  if (userManager.deleteUserById(id)) {
    refreshAllData();
  } else {
    alert("User not found!");
  }
}

function handleTaskCreate(): void {
  const id = parseInt(getElement<HTMLInputElement>("taskId").value);
  const title = getElement<HTMLInputElement>("taskTitle").value;
  const desc = getElement<HTMLTextAreaElement>("taskDesc").value;

  userManager.createTask(id, title, desc);
  refreshAllData();
}

function handleTaskDelete(): void {
  const id = parseInt(getElement<HTMLInputElement>("taskId").value);
  if (userManager.deleteTaskById(id)) {
    refreshAllData();
  } else {
    alert("Task not found!");
  }
}

function handleAssignTask(): void {
  const taskId = parseInt(getElement<HTMLInputElement>("assignTaskId").value);
  const userId = parseInt(getElement<HTMLInputElement>("assignUserId").value);

  if (!userManager.assignTaskToUser(taskId, userId)) {
    alert("Task or User not found!");
  }
  refreshAllData();
}

function handleUnassignTask(): void {
  const taskId = parseInt(getElement<HTMLInputElement>("assignTaskId").value);
  if (!userManager.unassignTask(taskId)) {
    alert("Task not found or already unassigned!");
  }
  refreshAllData();
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // User Management Event Listeners
  getElement<HTMLButtonElement>("createUserBtn").addEventListener(
    "click",
    handleUserCreate
  );
  getElement<HTMLButtonElement>("updateUserBtn").addEventListener(
    "click",
    handleUserUpdate
  );
  getElement<HTMLButtonElement>("deleteUserBtn").addEventListener(
    "click",
    handleUserDelete
  );

  // Task Management Event Listeners
  getElement<HTMLButtonElement>("createTaskBtn").addEventListener(
    "click",
    handleTaskCreate
  );
  getElement<HTMLButtonElement>("deleteTaskBtn").addEventListener(
    "click",
    handleTaskDelete
  );
  getElement<HTMLButtonElement>("assignTaskBtn").addEventListener(
    "click",
    handleAssignTask
  );
  getElement<HTMLButtonElement>("unassignTaskBtn").addEventListener(
    "click",
    handleUnassignTask
  );

  // New Feature Event Listeners
  getElement<HTMLButtonElement>("refreshAllBtn").addEventListener("click", () =>
    location.reload()
  );
  getElement<HTMLButtonElement>("expandUsersBtn").addEventListener(
    "click",
    () => toggleFullscreen("user-management")
  );
  getElement<HTMLButtonElement>("expandTasksBtn").addEventListener(
    "click",
    () => toggleFullscreen("task-management")
  );

  // Search and Filter Event Listeners
  getElement<HTMLInputElement>("userSearch").addEventListener("input", (e) =>
    filterUsers((e.target as HTMLInputElement).value)
  );
  getElement<HTMLInputElement>("taskSearch").addEventListener("input", (e) =>
    filterTasks((e.target as HTMLInputElement).value)
  );
  getElement<HTMLSelectElement>("taskFilter").addEventListener("change", (e) =>
    filterTasksByStatus((e.target as HTMLSelectElement).value)
  );

  // Initial render
  refreshAllData();
});
