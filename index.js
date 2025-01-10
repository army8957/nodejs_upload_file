const express   = require("express"); //import express ด้วยการใช้ require
const app       = express(); //set express ไว้เป็นตัวแปร app
const multer    = require('multer');

// const path      = require('path');
// const upload = multer({ dest: 'uploads/' })
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './uploads') // folder ที่เราต้องการเก็บไฟล์
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.originalname) //ให้ใช้ชื่อไฟล์ original เป็นชื่อหลังอัพโหลด
//     },
// })
// const upload = multer({ storage })

//ใช้ get เพื่อเรียกไฟล์ index.html
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

// กำหนดที่เก็บไฟล์และตั้งชื่อไฟล์
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads'); // โฟลเดอร์ที่เก็บไฟล์
    },
    filename: (req, file, callback) => {
        const sanitizedFilename = file.originalname.replace(/\s+/g, '-'); // แทนที่ช่องว่างด้วย -
        callback(null, `${Date.now()}-${sanitizedFilename}`); // ตั้งชื่อไฟล์ใหม่
    },
});
  
// กำหนดตัวกรองไฟล์
const fileFilter = (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('File type not allowed'), false);
    }
};
  
// สร้าง middleware ของ multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // จำกัดขนาดไฟล์ที่ 5MB
});

// Route สำหรับแสดงฟอร์ม upload
app.get('/', (req, res) => {
    res.send(`
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="photo" />
        <button type="submit">Upload</button>
      </form>
    `);
  });

//ใช้ post เพื่อรองรับการ upload
app.post('/upload', upload.single('photo'), (req, res) => {
    // res.send(req.file)
    console.log(req);
    res.send('Upload Complete')
});

// ใช้ listen เพื่อระบุว่า website จะทำงานที่ port อะไร เราใช้ให้เรียกตัวแปร port
const port = 3000; //set ตัวแปร port เท่ากับ 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});