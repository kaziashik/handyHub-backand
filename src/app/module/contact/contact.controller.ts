import { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { name, email, message } = req.body as {
    name: string;
    email: string;
    message: string;
  };

  await transporter.sendMail({
    from: config.email_sender,
    to: config.email_sender,
    replyTo: email,
    subject: `HandyHub contact from ${name}`,
    text: `${name} <${email}>\n\n${message}`,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message sent. We will reply by email.",
    data: null,
  });
});

export const ContactController = { sendMessage };
