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
class userManager {
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
            user.updateUser(name, email);
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
const usermanager = new userManager();
function refreshUserList() {
    const container = document.getElementById("usersList");
    container.innerHTML = usermanager.users
        .map((user) => `
        <div class="user-card">
          <h3>${user.name} (ID: ${user.id})</h3>
          <p>Email: ${user.email}</p>
          <p>Status: ${user.isActive ? "Active" : "Inactive"}</p>
        </div>`)
        .join("");
}
function refreshTaskList() {
    const container = document.getElementById("tasksList");
    container.innerHTML = usermanager.tasks
        .map((task) => `
        <div class="task-card ${task.assignedUserId ? "assigned" : "unassigned"}">
          <h3>${task.title} (ID: ${task.id})</h3>
          <p>${task.description}</p>
          <p>${task.assignedUserId
        ? `Assigned to User ${task.assignedUserId}`
        : "Unassigned"}</p>
        </div>`)
        .join("");
}
// create user
function handleUserCreate() {
    const id = parseInt(document.getElementById("userId").value);
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail")
        .value;
    const isActive = document.getElementById("userActive")
        .checked;
    usermanager.createUser(id, name, email, isActive);
    refreshUserList();
}
// update user
function handleUserUpdate() {
    const id = parseInt(document.getElementById("userId").value);
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail")
        .value;
    const isActive = document.getElementById("userActive")
        .checked;
    usermanager.updateUserById(id, name, email, isActive);
    refreshUserList();
}
//delete user
function handleUserDelete() {
    const id = parseInt(document.getElementById("userId").value);
    usermanager.deleteUserById(id);
    refreshUserList();
    refreshTaskList();
}
//task
/**
 * create task
 */
function handleTaskCreate() {
    const id = parseInt(document.getElementById("taskId").value);
    const title = document.getElementById("taskTitle")
        .value;
    const desc = document.getElementById("taskDesc").value;
    usermanager.createTask(id, title, desc);
    refreshTaskList();
}
/**
 * delete task
 */
function handleTaskDelete() {
    const id = parseInt(document.getElementById("taskId").value);
    usermanager.deleteTaskById(id);
    refreshTaskList();
}
/**
 *
 */
function handleAssignTask() {
    const taskId = parseInt(document.getElementById("assignTaskId").value);
    const userId = parseInt(document.getElementById("assignUserId").value);
    !usermanager.assignTaskToUser(taskId, userId);
    if (!usermanager.assignTaskToUser(taskId, userId)) {
        alert("Task or User not found!");
    }
    refreshTaskList();
}
function handleUnassignTask() {
    const taskId = parseInt(document.getElementById("assignTaskId").value);
    usermanager.unassignTask(taskId);
    refreshTaskList();
}
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("createUserBtn").addEventListener("click", handleUserCreate);
    document.getElementById("updateUserBtn").addEventListener("click", handleUserUpdate);
    document.getElementById("deleteUserBtn").addEventListener("click", handleUserDelete);
    document.getElementById("createTaskBtn").addEventListener("click", handleTaskCreate);
    document.getElementById("deleteTaskBtn").addEventListener("click", handleTaskDelete);
    document.getElementById("assignTaskBtn").addEventListener("click", handleAssignTask);
    document.getElementById("unassignTaskBtn").addEventListener("click", handleUnassignTask);
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
