const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({  // ← Sans "er"
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ''),
  },
});


transporter.verify((error) => {
  if (error) {
    process.exit(1);
  } else {
    
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: ' Test TalentProof',
      html: '<h1> Succès!</h1><p>Les emails fonctionnent!</p>',
    }, (err, info) => {
      if (err) {
      } else {
      }
      process.exit(0);
    });
  }
});