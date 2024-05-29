import { Request, Response } from "express";
import axios from "axios";

import { setUserCookies } from "../../../utils/auth.utils";
import { findOrCreateUser } from "../../../model/authencation/oauth/oauth.model";
import {
  ResponseStatus,
  ResponseMessages,
} from "../../../types/enums/responseEnums";
import { UserType } from "@prisma/client";

class GoogleAuthController {
  private static clientId: string = process.env.GOOGLE_CLIENT_ID!;
  private static clientSecret: string = process.env.GOOGLE_CLIENT_SECRET!;
  private static redirectUri: string = `${process.env.REDIRECT_URI}/google/callback`;
  private static readonly AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth";
  private static readonly TOKEN_URL = "https://oauth2.googleapis.com/token";
  private static readonly USER_INFO_URL =
    "https://www.googleapis.com/oauth2/v2/userinfo";

  public static async redirectToGoogleAuth(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authUrl = `${GoogleAuthController.AUTH_URL}?client_id=${GoogleAuthController.clientId}&redirect_uri=${GoogleAuthController.redirectUri}&response_type=code&scope=email profile`;
    response.status(ResponseStatus.Redirect).redirect(authUrl);
  }

  public static async handleGoogleCallback(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authorizationCode = request.query.code as string;
    try {
      const authorizationToken = await axios.post(
        GoogleAuthController.TOKEN_URL,
        {
          code: authorizationCode,
          client_id: GoogleAuthController.clientId,
          client_secret: GoogleAuthController.clientSecret,
          redirect_uri: GoogleAuthController.redirectUri,
          grant_type: "authorization_code",
        },
      );

      const userInfoResponse = await axios.get(
        GoogleAuthController.USER_INFO_URL,
        {
          headers: {
            Authorization: `Bearer ${authorizationToken.data.access_token}`,
          },
        },
      );

      const user = await findOrCreateUser(
        userInfoResponse.data.email,
        UserType.GOOGLE_USER,
      );

      setUserCookies(response, user);

      response
        .status(ResponseStatus.Success)
        .send({ message: ResponseMessages.Success });
    } catch (error) {
      console.error(error, "auth-google");
      response
        .status(ResponseStatus.InternalServerError)
        .json({ message: ResponseMessages.InternalServerError });
    }
  }
}

export default GoogleAuthController;
