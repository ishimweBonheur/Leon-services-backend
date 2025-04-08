const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/job'); 
const jobApplicationRoutes = require('./routes/jobApplication'); 
const { swaggerUi, specs } = require("./swagger");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({
  origin:'*',
  credentials: true, // Allow cookies to be sent across domains (if needed)
}));

app.use(express.json()); // ✅ Parse incoming JSON requests

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/jobs', jobRoutes); // Job posting routes
app.use('/api/applications', jobApplicationRoutes); // Job application routes

// ✅ Swagger Setup (API Documentation)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); // Swagger UI

// ✅ Global Error Handling Middleware (Optional but recommended for catching errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal server error" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
