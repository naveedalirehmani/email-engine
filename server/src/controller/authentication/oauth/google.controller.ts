import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";

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
  private static oAuth2Client = new OAuth2Client(
    GoogleAuthController.clientId,
    GoogleAuthController.clientSecret,
    GoogleAuthController.redirectUri,
  );

  public static async redirectToGoogleAuth(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authUrl = GoogleAuthController.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
    });
    response.status(ResponseStatus.Redirect).redirect(authUrl);
  }

  public static async handleGoogleCallback(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authorizationCode = request.query.code as string;

    try {
      const { tokens } =
        await GoogleAuthController.oAuth2Client.getToken(authorizationCode);
      GoogleAuthController.oAuth2Client.setCredentials(tokens);

      const ticket = await GoogleAuthController.oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: GoogleAuthController.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Unable to retrieve user info from Google.");
      }

      const user = await findOrCreateUser(
        payload.email!,
        UserType.GOOGLE_USER,
        "PLACEHOLDER",
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
