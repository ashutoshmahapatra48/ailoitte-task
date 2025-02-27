import { sequelize } from "../config/db.js";
import seedAdmin from "./adminSeeder.js";
import seedCategories from "./categorySeeder.js";
import seedProducts from "./productSeeder.js";

const seedDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database synced!");

    // await seedAdmin();
    // await seedCategories();
    await seedProducts();

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
