const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/job'); 
const jobApplicationRoutes = require('./routes/jobApplication'); 
const emailRoutes= require('./routes/email');
const contactsRoutes = require('./routes/contacts') 
const subscriptionsRoutes=require('./routes/subscription')
const { swaggerUi, specs } = require("./swagger");

dotenv.config();
const app = express();

app.use(cors({
  origin:'*',
  credentials: true, 
}));

app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/jobs', jobRoutes); 
app.use('/api/applications', jobApplicationRoutes); 
app.use('/api/email', emailRoutes); 
app.use('/api/contacts', contactsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal server error" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
