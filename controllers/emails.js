// controllers/emailController.js
require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body; 

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Please provide all required fields: to, subject, text' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to, 
    subject, 
    text, 
    html, 
  };

 
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};
