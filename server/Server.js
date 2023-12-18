const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const randomize = require('randomatic');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB with connection pooling
mongoose.connect('mongodb://127.0.0.1:27017/users', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// poolSize: 10,
});

const User = mongoose.model('User', {
	email: String,
	password: String,
	otp: String,
});

// Function to send OTP to the user's email
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    // Check if the provided OTP is valid
    const user = await User.findOne({ email, otp });
    if (user) {
      // Clear the OTP in the database after successful verification
      await User.updateOne({ email }, { $unset: { otp: 1 } });
      res.status(200).send('OTP verified successfully.');
    } else {
      res.status(400).send('Invalid OTP.');
    }
  });
  

app.post('/request-otp', async (req, res) => {
  const { email } = req.body;

 
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

 
  await User.findOneAndUpdate({ email }, { otp }, { upsert: true });


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vrajclerk44@gmail.com', 
      pass: 'vrajclerk44@', 
    },
  });

  const mailOptions = {
    from: 'vrajclerk04@gmail.com', 
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('OTP sent successfully.');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});