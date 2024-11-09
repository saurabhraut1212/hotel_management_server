
import nodemailer, { Transporter } from "nodemailer";

export const canModifyOrder = (orderDate: Date): boolean => {
  const currentTime = new Date();
  const timeDifference:number = (currentTime.getTime() - orderDate.getTime()) / 1000 / 60; 
  return timeDifference <= 10; 
};


export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER as string, 
        pass: process.env.EMAIL_PASSWORD as string,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to, 
      subject, 
      text, 
    };

   
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
