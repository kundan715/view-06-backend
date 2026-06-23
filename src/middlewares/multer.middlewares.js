import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
    //above method can be use to store file with the unique names 

    cb(null,file.originalname);
    //this method may create problem if same named files are uploaded
  }
})

const upload = multer({ storage, })