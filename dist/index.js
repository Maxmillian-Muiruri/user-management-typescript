"use strict";
class User {
    constructor(id, name, email, isActive) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isActive = isActive;
    }
    getUserInfo() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            isActive: this.isActive,
        };
    }
    updateUser(name, email) {
        this.name = name;
        this.email = email;
    }
}
class Task {
    constructor(id, title, description, assignedUserId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedUserId = assignedUserId;
    }
}
class UserManager {
    constructor() {
        this.users = [];
        this.tasks = [];
    }
    createUser(id, name, email, isActive) {
        const user = new User(id, name, email, isActive);
        this.users.push(user);
        return user;
    }
    createTask(id, title, description) {
        const task = new Task(id, title, description);
        this.tasks.push(task);
        return task;
    }
    assignTaskToUser(taskId, userId) {
        const task = this.tasks.find((t) => t.id === taskId);
        const user = this.users.find((u) => u.id === userId);
        if (task && user) {
            task.assignedUserId = userId;
            return true;
        }
        return false;
    }
    unassignTask(taskId) {
        const task = this.tasks.find((t) => t.id === taskId);
        if (task && task.assignedUserId !== undefined) {
            task.assignedUserId = undefined;
            return true;
        }
        return false;
    }
    getTasksForUser(userId) {
        return this.tasks.filter((t) => t.assignedUserId === userId);
    }
    updateUserById(id, name, email, isActive) {
        const user = this.users.find((u) => u.id === id);
        if (user) {
            user.name = name;
            user.email = email;
            user.isActive = isActive;
            return true;
        }
        return false;
    }
    deleteUserById(id) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
    deleteTaskById(id) {
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
function getElement(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`Element with id ${id} not found`);
    return element;
}
// Render Functions
function renderUsers(users) {
    const usersToRender = users || userManager.users;
    const container = getElement("usersList");
    container.innerHTML = usersToRender
        .map((user) => `
      <div class="user-card">
        <div class="user-id">#${user.id}</div>
        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-email">${user.email}</div>
        </div>
        <div class="user-status ${user.isActive ? "status-active" : "status-inactive"}">
          ${user.isActive ? "Active" : "Inactive"}
        </div>
      </div>`)
        .join("");
}
function renderTasks(tasks) {
    const tasksToRender = tasks || userManager.tasks;
    const container = getElement("tasksList");
    container.innerHTML = tasksToRender
        .map((task) => `
      <div class="task-card ${task.assignedUserId ? "assigned" : "unassigned"}">
        <div class="task-id">#${task.id}</div>
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-desc">${task.description}</div>
          <div class="task-assignee">
            ${task.assignedUserId
        ? `<i class="fas fa-user-check"></i> Assigned to user #${task.assignedUserId}`
        : `<span class="no-assignee"><i class="fas fa-user-times"></i> Unassigned</span>`}
          </div>
        </div>
      </div>`)
        .join("");
}
function updateCounters() {
    const userCount = getElement("userCount");
    const taskCount = getElement("taskCount");
    userCount.textContent = userManager.users.length.toString();
    taskCount.textContent = userManager.tasks.length.toString();
}
function refreshAllData() {
    renderUsers();
    renderTasks();
    updateCounters();
}
// Search and Filter Functions
function filterUsers(searchTerm) {
    const filtered = userManager.users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm));
    renderUsers(filtered);
}
function filterTasks(searchTerm) {
    const filtered = userManager.tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toString().includes(searchTerm));
    renderTasks(filtered);
}
function filterTasksByStatus(status) {
    let filtered = [];
    switch (status) {
        case "assigned":
            filtered = userManager.tasks.filter((task) => task.assignedUserId !== undefined);
            break;
        case "unassigned":
            filtered = userManager.tasks.filter((task) => task.assignedUserId === undefined);
            break;
        default:
            filtered = [...userManager.tasks];
    }
    renderTasks(filtered);
}
// Fullscreen Functionality
function toggleFullscreen(sectionClass) {
    const section = document.querySelector(`.${sectionClass}`);
    if (!section)
        return;
    section.classList.toggle("fullscreen");
    const btn = document.getElementById(`${sectionClass === "user-management" ? "expandUsersBtn" : "expandTasksBtn"}`);
    const icon = btn === null || btn === void 0 ? void 0 : btn.querySelector("i");
    if (icon) {
        icon.classList.toggle("fa-expand");
        icon.classList.toggle("fa-compress");
    }
}
// Event Handlers
function handleUserCreate() {
    const id = parseInt(getElement("userId").value);
    const name = getElement("userName").value;
    const email = getElement("userEmail").value;
    const isActive = getElement("userActive").checked;
    userManager.createUser(id, name, email, isActive);
    refreshAllData();
}
function handleUserUpdate() {
    const id = parseInt(getElement("userId").value);
    const name = getElement("userName").value;
    const email = getElement("userEmail").value;
    const isActive = getElement("userActive").checked;
    if (userManager.updateUserById(id, name, email, isActive)) {
        refreshAllData();
    }
    else {
        alert("User not found!");
    }
}
function handleUserDelete() {
    const id = parseInt(getElement("userId").value);
    if (userManager.deleteUserById(id)) {
        refreshAllData();
    }
    else {
        alert("User not found!");
    }
}
function handleTaskCreate() {
    const id = parseInt(getElement("taskId").value);
    const title = getElement("taskTitle").value;
    const desc = getElement("taskDesc").value;
    userManager.createTask(id, title, desc);
    refreshAllData();
}
function handleTaskDelete() {
    const id = parseInt(getElement("taskId").value);
    if (userManager.deleteTaskById(id)) {
        refreshAllData();
    }
    else {
        alert("Task not found!");
    }
}
function handleAssignTask() {
    const taskId = parseInt(getElement("assignTaskId").value);
    const userId = parseInt(getElement("assignUserId").value);
    if (!userManager.assignTaskToUser(taskId, userId)) {
        alert("Task or User not found!");
    }
    refreshAllData();
}
function handleUnassignTask() {
    const taskId = parseInt(getElement("assignTaskId").value);
    if (!userManager.unassignTask(taskId)) {
        alert("Task not found or already unassigned!");
    }
    refreshAllData();
}
// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    // User Management Event Listeners
    getElement("createUserBtn").addEventListener("click", handleUserCreate);
    getElement("updateUserBtn").addEventListener("click", handleUserUpdate);
    getElement("deleteUserBtn").addEventListener("click", handleUserDelete);
    // Task Management Event Listeners
    getElement("createTaskBtn").addEventListener("click", handleTaskCreate);
    getElement("deleteTaskBtn").addEventListener("click", handleTaskDelete);
    getElement("assignTaskBtn").addEventListener("click", handleAssignTask);
    getElement("unassignTaskBtn").addEventListener("click", handleUnassignTask);
    // New Feature Event Listeners
    getElement("refreshAllBtn").addEventListener("click", () => location.reload());
    getElement("expandUsersBtn").addEventListener("click", () => toggleFullscreen("user-management"));
    getElement("expandTasksBtn").addEventListener("click", () => toggleFullscreen("task-management"));
    // Search and Filter Event Listeners
    getElement("userSearch").addEventListener("input", (e) => filterUsers(e.target.value));
    getElement("taskSearch").addEventListener("input", (e) => filterTasks(e.target.value));
    getElement("taskFilter").addEventListener("change", (e) => filterTasksByStatus(e.target.value));
    // Initial render
    refreshAllData();
});
