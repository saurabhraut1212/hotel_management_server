import { Request, Response } from "express";
import { ContactModel, IContact } from "../models/contactModel";
import nodemailer, { Transporter } from "nodemailer";
import { contactValidationSchema } from "../validations/contactValidation";

const adminEmail: string = process.env.ADMIN_EMAIL as string;
const adminEmailPassword: string = process.env.ADMIN_PASSWORD as string;

export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
  const { name, email, message }: IContact = req.body;


  const { error } = contactValidationSchema.validate({ name, email, message });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    
    const contactMessage = new ContactModel({ name, email, message });
    await contactMessage.save();

  
    const transporter: Transporter = nodemailer.createTransport({
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
  } catch (error: any) {
    console.error("Error sending contact message:", error.message);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
};
