"use strict";
// class User {
//   id: number;
//   name: string;
//   email: string;
//   isActive: boolean;
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
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}
class userManager {
    constructor() {
        this.users = [];
    }
    createUser(id, name, email, isActive) {
        const user = new User(id, name, email, isActive);
        this.users.push(user);
        return user;
    }
    //update user by id
    updateUserById(id, name, email) {
        const user = this.users.find((u) => u.id === id);
        if (user) {
            user.updateUser(name, email);
            return true;
        }
        return false;
    }
    // delete user by id
    deleteUserById(id) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}
const usermanager = new userManager();
const newUser = usermanager.createUser(1, "Alice Smith", "alice@example.com", true);
console.log(newUser.getUserInfo());
const updateUser = usermanager.createUser(2, "Maxmillin Muiruri", "maxmillianmuiruri@gmail.com", true);
newUser.updateUser("Alice Johnson", "alice.johnson@example.com");
console.log(newUser.getUserInfo());
// Delete the user
const deleted = usermanager.deleteUserById(2);
console.log("User deleted:", deleted);
const newTask = new Task(1, "Complete Assignment", "Finish the TypeScript assignment by tomorrow.");
console.log(newTask);
