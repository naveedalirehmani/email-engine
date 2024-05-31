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

  private static redirectUri: string = process.env.REDIRECT_URI!;
  private static readonly AUTH_URL =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
  private static readonly TOKEN_URL =
    "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  private static readonly USER_INFO_URL = "https://graph.microsoft.com/v1.0/me";

  public static async redirectToOutlookAuth(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authUrl = `${OutlookAuthController.AUTH_URL}?client_id=${OutlookAuthController.clientId}&redirect_uri=${encodeURIComponent(OutlookAuthController.redirectUri)}&response_type=code&scope=openid profile email User.Read offline_access Acronym.Read.All Mail.Read Mail.Read.Shared Mail.ReadBasic Mail.ReadBasic.Shared Mail.ReadWrite Mail.ReadWrite.Shared Mail.Send Mail.Send.Shared SMTP.Send User.ReadWrite`;
    response.status(ResponseStatus.Success).send(authUrl);
  }

  public static async handleOutlookCallback(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authorizationCode = request.query.code as string;
    if (!authorizationCode) {
      response
        .status(ResponseStatus.BadRequest)
        .json({ message: "Authorization code is missing" });
      return;
    }
    try {
      const tokenResponse = await axios.post(
        OutlookAuthController.TOKEN_URL,
        new URLSearchParams({
          code: authorizationCode,
          client_id: OutlookAuthController.clientId,
          client_secret: OutlookAuthController.clientSecret,
          redirect_uri: OutlookAuthController.redirectUri,
          grant_type: "authorization_code",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      console.log("Token response:", tokenResponse.data);

      const userInfoResponse = await axios.get(
        OutlookAuthController.USER_INFO_URL,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        },
      );

      console.log("User info response:", userInfoResponse.data);

      const user = await findOrCreateUser(
        userInfoResponse.data.mail || userInfoResponse.data.userPrincipalName,
        UserType.OUTLOOK_USER,
        userInfoResponse.data.displayName,
      );

      setUserCookies(response, user, tokenResponse.data.access_token);

      response
        .status(ResponseStatus.Redirect)
        .redirect("http://localhost:3000/mail");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Error during Outlook authentication:",
          error.response.data,
        );
        response.status(ResponseStatus.InternalServerError).json({
          message:
            error.response.data.error_description ||
            ResponseMessages.InternalServerError,
        });
        return;
      }
      console.error("Unexpected error during Outlook authentication:", error);
      response
        .status(ResponseStatus.InternalServerError)
        .json({ message: ResponseMessages.InternalServerError });
    }
  }
}

export default OutlookAuthController;
