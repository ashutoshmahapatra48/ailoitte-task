import Category from "../models/Category.js";

const seedCategories = async () => {
  try {

    const categories = [
      { name: "Electronics", description: "Electronic gadgets and devices" },
      { name: "Fashion", description: "Clothing and accessories" },
      { name: "Home & Kitchen", description: "Home appliances and kitchen items" },
      { name: "Books", description: "A collection of books across various genres" },
      { name: "Sports", description: "Sports equipment and accessories" },
    ];

    await Category.bulkCreate(categories);
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  }
};

export default seedCategories;
