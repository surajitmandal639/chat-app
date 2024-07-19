// Import the correct function or object from uploadFile.js
const { uploadMultipleFiles } = require("../../utils/uploadFile");

// Middleware to use in your route
const uploadAttachment = (req, res, next) => {
  try {
    const upload = uploadMultipleFiles("attachment", /jpeg|jpg|png|gif|pdf|docx|xlsx/, 1024 * 1024 * 5, 5); // 5MB limit

    upload(req, res, (err) => {
      if (err) {
        console.error("Upload Error:", err);
        // return res.status(400).send("Error uploading file");
        return res.status(400).json({ errors: { attachment: { msg: err.message } } });
      }
      // console.log("File uploaded successfully:", req.file);
      next();
    });
  } catch (error) {
    console.error("Catch Error:", error);
    return res.status(500).json({ errors: { common: { msg: error.message } } });
  }
};

module.exports = uploadAttachment;
