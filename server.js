const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/job'); 
const jobApplicationRoutes = require('./routes/jobApplication'); 
const { swaggerUi, specs } = require("./swagger");

dotenv.config();
const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// API Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs',jobRoutes);
app.use('/api/v1/applications', jobApplicationRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
