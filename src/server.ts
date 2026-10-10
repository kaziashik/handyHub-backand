import "dotenv/config";
import type { Request, Response } from "express";
import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";
import { transporter } from "./app/lib/nodemailer";
import { redisClient } from "./app/lib/redits";
import {
  seedDemoCustomer,
  seedSuperAdmin,
  seedTesterAdmin,
  seedTesterTechinican,
} from "./app/utils/seend";
import { deleteUnverifiedTechinician } from "./app/lib/cron";

const PORT = config.port;

async function connectServices() {
  await prisma.$connect();
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

async function main() {
  try {
    await connectServices();
    console.log("Connected to the database successfully.");
    console.log("Redis Connected Successfully");

    await transporter.verify();
    console.log("NodeMailer connected successfully");

    await seedSuperAdmin();
    await seedTesterAdmin();
    await seedTesterTechinican();
    await seedDemoCustomer();
    await deleteUnverifiedTechinician();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

let ready: Promise<void> | null = null;

const handler = (req: Request, res: Response) => {
  const start = ready ?? (ready = connectServices());
  start
    .then(() => {
      app(req, res);
    })
    .catch((error) => {
      console.error("Error starting the server:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Server failed to start",
        });
      }
    });
};

export default handler;

if (!process.env.VERCEL) {
  main();
}