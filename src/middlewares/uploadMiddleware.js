// import multer from "multer";

// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage });

// export default upload;

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure temp folder exists
// const tempFolder = path.join(__dirname, "../temp");
// if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, tempFolder); // Save files in temp folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ 
    storage,
})
export default upload;