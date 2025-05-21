// class User {
//   id: number;
//   name: string;
//   email: string;
//   isActive: boolean;

//   constructor(id: number, name: string, email: string, isActive: boolean) {
//     this.id = id;
//     this.name = name;
//     this.email = email;
//     this.isActive = isActive;
//   }

//   updateUser(name: string, email: string): void {
//     this.id = this.id;
//     this.name = name;
//     this.email = email;
//   }
//   deleteUser(): void {
//     this.name = "";
//     this.id = 0;
//     this.email = "";
//     this.isActive = false;
//   }
//   geteUser(): void {
//     this.id = 0
//     this.name= ''
//     this.email = ''
//     this.isActive = false;
//   }
// }

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
    public description: string
  ) {}
}

class userManager {
  private users: User[] = [];

  createUser(id: number, name: string, email: string, isActive: boolean): User {
    const user = new User(id, name, email, isActive);
    this.users.push(user);
    return user;
  }

  //update user by id
  updateUserById(id: number, name: string, email: string): boolean {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      user.updateUser(name, email);
      return true;
    }
    return false;
  }

  // delete user by id
  deleteUserById(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

const usermanager = new userManager();
const newUser = usermanager.createUser(
  1,
  "Alice Smith",
  "alice@example.com",
  true
);

console.log(newUser.getUserInfo());

const updateUser = usermanager.createUser(
  2,
  "Maxmillin Muiruri",
  "maxmillianmuiruri@gmail.com",
  true
);

newUser.updateUser("Alice Johnson", "alice.johnson@example.com");
console.log(newUser.getUserInfo());

// Delete the user
const deleted = usermanager.deleteUserById(2);
console.log("User deleted:", deleted);

const newTask = new Task(
  1,
  "Complete Assignment",
  "Finish the TypeScript assignment by tomorrow."
);

console.log(newTask);
