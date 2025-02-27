import Product from "../models/Product.js";
import Category from "../models/Category.js";

const seedProducts = async () => {
  try {
    const categories = await Category.findAll();

    if (categories.length === 0) {
      console.log("No categories found! Please seed categories first.");
      return;
    }

    const imagePath = "https://res.cloudinary.com/dxe3w6vrw/image/upload/v1740645099/izfeeeqwmytaat2zyvin.jpg";

    const products = [
      { name: "Laptop", description: "Gaming laptop", price: 1200, stock: 10, categoryId: categories[0].id, imageUrl: imagePath },
      { name: "Smartphone", description: "Android phone", price: 800, stock: 15, categoryId: categories[0].id, imageUrl: imagePath },
      { name: "T-Shirt", description: "Cotton T-Shirt", price: 20, stock: 50, categoryId: categories[1].id, imageUrl: imagePath },
      { name: "Microwave", description: "Kitchen microwave", price: 150, stock: 12, categoryId: categories[2].id, imageUrl: imagePath },
      { name: "Harry Potter Book", description: "Fantasy novel", price: 30, stock: 100, categoryId: categories[3].id, imageUrl: imagePath },
      { name: "Football", description: "Official FIFA football", price: 40, stock: 25, categoryId: categories[4].id, imageUrl: imagePath },
    ];

    await Product.bulkCreate(products);
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error.message);
  }
};

export default seedProducts;
