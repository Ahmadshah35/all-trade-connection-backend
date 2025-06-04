const multer = require("multer");
const path = require("path");
const fs = require("fs")

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/project"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
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

const imagePath = path.join(__dirname, "../public/profile")
const documentPath = path.join(__dirname, "../public/document");
[imagePath, documentPath].forEach(dir =>{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true});
    }
});

const Storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.mimetype.startsWith("image/")){
            cb(null, imagePath);
            // imagePath
        } else if(file.mimetype === "application/pdf"){
            cb(null, documentPath);
            // documentPath
        } else {
            cb( new Error("Invalid File Type!"), false);
        }
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({
    storage: Storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});









module.exports = { projectUpload, profileUpload ,upload };






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
