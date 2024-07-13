// Import the correct function or object from uploadFile.js
const { uploadSingleFile } = require("../../utils/uploadFile");

// Middleware to use in your route
const uploadAvatar = (req, res, next) => {
  try {
    const upload = uploadSingleFile("avatar", /jpeg|jpg|png|gif/, 1024 * 1024 * 5); // 5MB limit

    upload(req, res, (err) => {
      if (err) {
        console.error("Upload Error:", err);
        return res.status(400).send("Error uploading file");
      }
      // console.log("File uploaded successfully:", req.file);
      next();
    });
  } catch (error) {
    console.error("Catch Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = uploadAvatar;
