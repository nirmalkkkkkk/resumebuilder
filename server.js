const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '.')));

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// API endpoint to receive resume data and files
app.post('/api/resume', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'certifications', maxCount: 10 }
]), (req, res) => {
  const data = req.body;
  const files = req.files;
  const entry = {
    ...data,
    photo: files.photo ? files.photo[0].filename : null,
    certifications: files.certifications ? files.certifications.map(f => f.filename) : []
  };
  fs.appendFileSync('resumes.json', JSON.stringify(entry) + '\n');
  res.json({ success: true, message: 'Resume stored successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});