const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to ensure directory exists or create it
const ensureDirectoryExistence = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    return true;
  }
  fs.mkdirSync(dirPath, { recursive: true });
};

// Function to upload a single file
const uploadSingleFile = (destination, fileTypeRegex, fileSizeLimit) => {
  // Define storage for the uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const basePath = path.join(__dirname, "../public/uploads");
      ensureDirectoryExistence(basePath);

      const uploadPath = path.join(basePath, `${destination}s`);
      ensureDirectoryExistence(uploadPath);

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = Date.now() + path.extname(file.originalname);
      cb(null, filename);
    },
  });

  // File filter
  const fileFilter = (req, file, cb) => {
    const mimetype = fileTypeRegex.test(file.mimetype);
    const extname = fileTypeRegex.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  };

  // Upload middleware for single file
  return multer({
    storage: storage,
    limits: { fileSize: fileSizeLimit }, // File size limit
    fileFilter: fileFilter,
  }).single(destination); // Use fieldName dynamically
};

// Function to upload multiple files
const uploadMultipleFiles = (destination, fileTypeRegex, fileSizeLimit, maxFiles) => {
  // Define storage for the uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const basePath = path.join(__dirname, "../public/uploads");
      ensureDirectoryExistence(basePath);

      const uploadPath = path.join(basePath, `${destination}s`);
      ensureDirectoryExistence(uploadPath);

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = Date.now() + path.extname(file.originalname);
      cb(null, filename);
    },
  });

  // File filter
  const fileFilter = (req, file, cb) => {
    const mimetype = fileTypeRegex.test(file.mimetype);
    const extname = fileTypeRegex.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  };

  // Upload middleware for multiple files
  return multer({
    storage: storage,
    limits: { fileSize: fileSizeLimit }, // File size limit
    fileFilter: fileFilter,
  }).array(destination, maxFiles); // Use fieldName dynamically
};

module.exports = { uploadSingleFile, uploadMultipleFiles };
