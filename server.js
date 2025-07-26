const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// ===== Connect to MongoDB =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// ===== Booking Schema and Routes =====
const bookingSchema = new mongoose.Schema({
  name: String,
  age: Number,
  classType: String,
  date: String,
  email: String,
  parentPhone: String,
  location: String,
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: '✅ Booking saved successfully', booking });
  } catch (err) {
    res.status(400).json({ message: '❌ Failed to save booking', error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching bookings', error: err.message });
  }
});

// ===== Application Schema and Routes =====
const applicationSchema = new mongoose.Schema({
  name: String,
  age: Number,
  classType: String,
  date: String,
  email: String,
  phone: String,
  location: String,
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

app.post('/api/applications', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json({ message: '✅ Application submitted successfully', application });
  } catch (err) {
    res.status(400).json({ message: '❌ Failed to submit application', error: err.message });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching applications', error: err.message });
  }
});

// ===== Frontend Routes =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/admin.html'));
});

app.get('/application', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/app.html')); // assuming it's app.html
});

app.get('/pricing', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/pricing.html'));
});

app.get('/dkc', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dkc.html'));
});

// ===== Start the Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
