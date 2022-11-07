const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'doc/uploads/')
    },
    filename: function (req, file, cb) {    
        if(file.size > 3000){
            throw new Error("Dosya boyutu çok fazla");
        }
        cb(null, file.fieldname + '-' + Date.now() + '_' + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

module.exports = upload;