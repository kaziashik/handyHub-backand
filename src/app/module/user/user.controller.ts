import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error("No file provided.");
  }

  const userId = req.user?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await UserServices.uploadProfileImage(req.file.buffer, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile image uploaded successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = await UserServices.updateProfile(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await UserServices.getCustomers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customers retrieved successfully",
    data,
    meta,
  });
});

export const UserController = {
  uploadProfileImage,
  updateProfile,
  getCustomers,
};