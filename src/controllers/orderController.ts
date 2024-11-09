import { Request, Response } from "express";
import { ContactModel } from "../models/contactModel";
import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { contactValidationSchema } from "../validations/contactValidation";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL as string;
const adminEmailPassword = process.env.ADMIN_EMAIL_PASSWORD as string;

export const sendContactMessage = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

 
  const { error } = contactValidationSchema.validate({ name, email, message });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
  
    const contactMessage = new ContactModel({ name, email, message });
    await contactMessage.save();

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmail,
        pass: adminEmailPassword,
      },
    });

    const mailOptions = {
      from: email,
      to: adminEmail,
      subject: "New Contact Us Message",
      text: `You have received a new message from:
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
    };

    
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};
