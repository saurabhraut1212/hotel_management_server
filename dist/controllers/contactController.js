"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactMessage = void 0;
const contactModel_1 = require("../models/contactModel");
const nodemailer_1 = __importDefault(require("nodemailer"));
const contactValidation_1 = require("../validations/contactValidation");
const adminEmail = process.env.ADMIN_EMAIL;
const adminEmailPassword = process.env.ADMIN_PASSWORD;
const sendContactMessage = async (req, res) => {
    const { name, email, message } = req.body;
    const { error } = contactValidation_1.contactValidationSchema.validate({ name, email, message });
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    try {
        const contactMessage = new contactModel_1.ContactModel({ name, email, message });
        await contactMessage.save();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: adminEmail,
                pass: adminEmailPassword,
            },
        });
        const mailOptions = {
            from: `${name} <${email}>`,
            replyTo: email,
            to: adminEmail,
            subject: "New Contact Us Message",
            text: `You have received a new message from:
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Your message has been sent successfully!" });
    }
    catch (error) {
        console.error("Error sending contact message:", error.message);
        res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
};
exports.sendContactMessage = sendContactMessage;
