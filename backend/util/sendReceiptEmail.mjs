import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendReceiptEmail = async ({
  email,
  fullName,
  orderID,
  dateTime,
  totalAmount,
  productList,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Receipt for Your Order - ${orderID}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center;">
          <img src="cid:logo" width="150" alt="UrbanTrove Logo" style="margin-bottom: 10px;">
        </div>
        <h2 style="color: #333; text-align: center;">Thank you for your purchase, ${fullName}!</h2>
        <p style="color: #555; text-align: center;">Your order <strong>${orderID}</strong> has been confirmed.</p>
        <p style="text-align: center;"><strong>Date & Time:</strong> ${dateTime}</p>
        <hr style="border: 1px solid #ddd;">
        
        <h3 style="color: #333;">Order Details:</h3>
        <ul style="padding: 0 20px; color: #555;">${productList}</ul>
        
        <h3 style="color: #333;">Total Amount Paid: <span style="color: #27ae60;">₹${totalAmount}</span></h3>
        <p style="text-align: center; color: #555;">Thank you for shopping with UrbanTrove!</p>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://urbantrove.in" style="display: inline-block; background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Store</a>
        </div>

        <div style="text-align: center; margin-top: 40px; border-top: 2px solid #ddd; padding-top: 20px;">
          <p style="color: #555; font-size: 16px; margin-bottom: 10px;">Powered By <strong style="color: #000;">WebFlex</strong></p>
          <img src="cid:webflex" width="120" alt="WebFlex Logo" style="border-radius: 5px;">
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "logo-removebg-preview.png",
        path: path.join(__dirname, "../public/logo-removebg-preview.png"),
        cid: "logo",
      },
      {
        filename: "name.png",
        path: path.join(__dirname, "../public/name.png"),
        cid: "webflex",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
