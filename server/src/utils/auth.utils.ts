import { User } from "@prisma/client";
import { Response } from "express";
import { signJWT } from "./jwt.utils";
import { environment } from "../types/global";

const ACCESS_TOKEN_MAX_AGE = 3600000 * 12; // 12 hour in milliseconds
const REFRESH_TOKEN_MAX_AGE = 3.154e10; // 1 year in milliseconds
const IS_PRODUCTION = process.env.NODE_ENV === environment.PRODUCTION;

export function setUserCookies(
  response: Response,
  user: User,
  oAuthAccessToken?: string,
) {
  const accessToken = signJWT(
    {
      email: user.email,
      userId: `${user.id}`,
      role: user.role,
      oAuthAccessToken,
    },
    "1h",
  );
  const refreshToken = signJWT(
    {
      email: user.email,
      userId: `${user.id}`,
      role: user.role,
      oAuthAccessToken,
    },
    "1y",
  );

  response.cookie("access_token_email_engine", accessToken, {
    maxAge: ACCESS_TOKEN_MAX_AGE,
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
    ...(IS_PRODUCTION && { domain: process.env.COOKIE_CLIENT }),
  });

  response.cookie("refresh_token_email_engine", refreshToken, {
    maxAge: REFRESH_TOKEN_MAX_AGE,
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "none" : "lax",
    ...(IS_PRODUCTION && { domain: process.env.COOKIE_CLIENT }),
  });
}
