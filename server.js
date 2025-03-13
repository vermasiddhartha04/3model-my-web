require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Check if EMAIL and PASSWORD are set in .env
if (!process.env.EMAIL || !process.env.PASSWORD) {
    console.error("❌ Error: EMAIL and PASSWORD must be set in .env file.");
    process.exit(1);
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Contact form route
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate request data
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: 'your-email@example.com', // Change this to your receiving email
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${email}`);
        res.status(200).json({ success: 'Email sent successfully!' });
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        res.status(500).json({ error: 'Failed to send email. Check server logs for details.' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
