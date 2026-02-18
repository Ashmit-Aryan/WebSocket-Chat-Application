import { Resend } from "resend";

export const resendClient = new Resend("re_8UYuRqDY_HAVTFB8xdYZuYxWUNh8hQ486");

export const sender = {
  email: process.env.RESEND_FROM_EMAIL || "noreply@chit-chat.com",
  name: process.env.RESEND_FROM_NAME || "Chit-Chat Team",
};