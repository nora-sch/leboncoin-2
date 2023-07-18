const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: "cloudinarynora",
  api_key: "233694994762479",
  api_secret: "cD3jcapOm_WauSJItQy3Aeb1_LY",
});

// const uploadImage = (file) => {
//   cloudinary.v2.uploader.upload(
//     file.path,
//     { public_id: file.filename, folder: "Leboncoin" },
//     function (error, result) {
//       console.log(result);
//     }
//   );
// };
// module.exports = {
//   // uploadImage,
//   cloudinary
// };
exports.default = cloudinary