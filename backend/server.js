const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upload = multer(); // For parsing form-data without files

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/complaints', upload.none(), complaintRoutes);
app.use('/api/notifications', upload.none(), notificationRoutes);
app.use('/api/villageAdmins', upload.none(), userRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));