const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir= path.resolve(__dirname, '../upload');  

if (!fs.existsSync(uploadDir)) {
    
  fs.mkdirSync(uploadDir);
}

  exports.upload = multer({ dest: uploadDir });
