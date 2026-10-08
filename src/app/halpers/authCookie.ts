import { Response } from "express";
import config from "../config";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const cookieOptions = {
  httpOnly: true,  // true/false
  secure: config.node_env === "production", // http / https
  sameSite:
    config.node_env === "production" ? ("none" as const) : ("lax" as const),
};  // none / strict / lax

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    console.log("cookieOptions:", cookieOptions);
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};
