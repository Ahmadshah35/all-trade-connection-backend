const multer = require("multer");
const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/project");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "image/webp",
//     "video/mp4",
//     "video/quicktime",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Only images, videos, PDFs, Word, Excel files are allowed!"),
//       false
//     );
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   // limits: { fileSize: 50 * 1024 * 1024 },
// });

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/project"); // Set your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to avoid conflicts
  },
});

const projectUpload = multer({ storage:projectStorage });


const ProfileStorage = multer.diskStorage({
  destination: "./public/profile",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const profileUpload = multer({
  storage: ProfileStorage,
});

module.exports = { projectUpload, profileUpload };
