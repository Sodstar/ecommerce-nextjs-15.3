// src/lib/seed.ts
import {connectDB} from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const users = [
    {
        name: "Sod-Od Batzorig",
        email: "sodstar@gmail.com",
        password: "91629162",
        image: "https://ui-avatars.com/api/?name=Admin+User&background=random",
      },
      {
        name: "Tester 1",
        email: "tester1@example.com",
        password: "91629162",
        image: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      {
        name: "Tester 2",
        email: "tester2@example.com",
        password: "91629162",
        image: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
      },
];

async function seedUsers() {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log("Deleted existing users");
    
    // Hash passwords and create users
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        return User.create({
          ...user,
          password: hashedPassword,
        });
      })
    );
    
    console.log(`Seeded ${createdUsers.length} users`);
    console.log("Sample user credentials:");
    users.forEach(user => {
      console.log(`Email: ${user.email}, Password: ${user.password}`);
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { error: "Failed to seed database" };
  }
}