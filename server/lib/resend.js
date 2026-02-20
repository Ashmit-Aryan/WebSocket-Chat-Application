import { Resend } from "resend";

import * as dotenv from "dotenv";
dotenv.config();
export const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sender = {
  email: process.env.RESEND_FROM_EMAIL || "noreply@chit-chat.com",
  name: process.env.RESEND_FROM_NAME || "Chit-Chat Team",
};