const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dw4elmc8k",
  api_key: "975724221587685",
  api_secret: "2prroz0HhNwJ35Mg9esrKZGe_Q0",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Allstore",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
