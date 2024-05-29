import { Request, Response } from "express";
import axios from "axios";

import { setUserCookies } from "../../../utils/auth.utils";
import { findOrCreateUser } from "../../../model/authencation/oauth/oauth.model";
import {
  ResponseStatus,
  ResponseMessages,
} from "../../../types/enums/responseEnums";
import { UserType } from "@prisma/client";

class OutlookAuthController {
  private static clientId: string = process.env.OUTLOOK_CLIENT_ID!;
  private static clientSecret: string = process.env.OUTLOOK_CLIENT_SECRET!;
  private static redirectUri: string = `${process.env.REDIRECT_URI}/outlook/callback`;
  private static readonly AUTH_URL =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
  private static readonly TOKEN_URL =
    "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  private static readonly USER_INFO_URL = "https://graph.microsoft.com/v1.0/me";

  public static async redirectToOutlookAuth(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authUrl = `${OutlookAuthController.AUTH_URL}?client_id=${OutlookAuthController.clientId}&redirect_uri=${OutlookAuthController.redirectUri}&response_type=code&scope=openid profile email`;
    response.status(ResponseStatus.Redirect).redirect(authUrl);
  }

  public static async handleOutlookCallback(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authorizationCode = request.query.code as string;
    try {
      const tokenResponse = await axios.post(
        OutlookAuthController.TOKEN_URL,
        new URLSearchParams({
          code: authorizationCode,
          client_id: OutlookAuthController.clientId,
          client_secret: OutlookAuthController.clientSecret,
          redirect_uri: OutlookAuthController.redirectUri,
          grant_type: "authorization_code",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const userInfoResponse = await axios.get(
        OutlookAuthController.USER_INFO_URL,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        },
      );

      const user = await findOrCreateUser(
        userInfoResponse.data.mail || userInfoResponse.data.userPrincipalName,
        UserType.OUTLOOK_USER,
      );

      setUserCookies(response, user);

      response
        .status(ResponseStatus.Success)
        .send({ message: ResponseMessages.Success });
    } catch (error) {
      console.error(error, "auth-outlook");
      response
        .status(ResponseStatus.InternalServerError)
        .json({ message: ResponseMessages.InternalServerError });
    }
  }
}

export default OutlookAuthController;
