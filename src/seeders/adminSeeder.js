import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ where: { email: "admin@example.com" } });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user seeded successfully!");
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

export default seedAdmin;
