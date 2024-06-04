import { Request, Response } from "express";
import axios from "axios";
import {
  ResponseStatus,
  ResponseMessages,
} from "../../types/enums/responseEnums";
import { replyEmailSchema, sendEmailSchema } from "../../schema/validation";
import { z } from "zod";

class EmailController {
  private static GRAPH_API_BASE_URL = "https://graph.microsoft.com/v1.0";
  private static async fetchEmails(
    folder: string,
    accessToken: string,
  ): Promise<any[]> {
    const url = `${EmailController.GRAPH_API_BASE_URL}/me/mailFolders/${folder}/messages?$select=subject,from,isRead,receivedDateTime,bodyPreview,body`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.value;
  }

  public static async getPrimaryEmails(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }
      const emails = await EmailController.fetchEmails("inbox", accessToken);
      return response
        .status(ResponseStatus.Success)
        .json({ message: ResponseMessages.Success, emails });
    } catch (error) {
      console.error("Error fetching primary emails:", error);
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }

  public static async getJunkEmails(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }
      const emails = await EmailController.fetchEmails(
        "junkemail",
        accessToken,
      );
      return response
        .status(ResponseStatus.Success)
        .json({ message: ResponseMessages.Success, emails });
    } catch (error) {
      console.error("Error fetching junk emails:", error);
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }

  public static async getTrashEmails(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }
      const emails = await EmailController.fetchEmails(
        "deleteditems",
        accessToken,
      );
      return response
        .status(ResponseStatus.Success)
        .json({ message: ResponseMessages.Success, emails });
    } catch (error) {
      console.error("Error fetching trash emails:", error);
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }

  public static async getSentEmails(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }
      const emails = await EmailController.fetchEmails(
        "sentitems",
        accessToken,
      );
      return response
        .status(ResponseStatus.Success)
        .json({ message: ResponseMessages.Success, emails });
    } catch (error) {
      console.error("Error fetching sent emails:", error);
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }

  public static async notifications(request: Request, response: Response) {
    try {
      const io = request.app.get("socketio");
      const { value: notifications } = request.body;

      notifications.forEach((notification: any) => {
        if (notification.clientState !== "YourClientStateValue") {
          return response
            .status(ResponseStatus.BadRequest)
            .send("Invalid client state");
        }

        io.emit("new_mail", notification);
      });

      return response
        .status(ResponseStatus.Accepted)
        .send(ResponseMessages.Accepted);
    } catch (error) {
      console.error("Error Notifications:", error);
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }

  public static async sendEmail(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }
      const validatedData = sendEmailSchema.parse(request.body);
      console.log(validatedData, "validatedData");
      const emailData = {
        message: {
          subject: validatedData.subject,
          body: {
            contentType: "Text",
            content: validatedData.body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: validatedData.toRecipients,
              },
            },
          ],
        },
        saveToSentItems: "true",
      };

      console.log("emailData:", JSON.stringify(emailData, null, 2));

      const url = `${EmailController.GRAPH_API_BASE_URL}/me/sendMail`;
      const apiResponse = await axios.post(url, emailData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("apiResponse:", apiResponse.data);

      return response
        .status(ResponseStatus.Success)
        .json({ message: ResponseMessages.Success });
    } catch (error) {
      console.error("error:", error);
      if (error instanceof z.ZodError) {
        return response
          .status(ResponseStatus.BadGateway)
          .json({ message: error.errors[0].message });
      }
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }

  public static async getTotalEmailCount(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }

      const profileUrl = `${EmailController.GRAPH_API_BASE_URL}/me`;
      const profileResponse = await axios.get(profileUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userProfile = profileResponse.data;
      const userName = userProfile.displayName;

      const folderNames = [
        { folder: "inbox", value: "/mail" },
        { folder: "junkemail", value: "/mail/junk" },
        { folder: "deleteditems", value: "/mail/trash" },
        { folder: "sentitems", value: "/mail/sent" },
      ];
      const emailCountsPromises = folderNames.map(async (folder) => {
        const url = `${EmailController.GRAPH_API_BASE_URL}/me/mailFolders/${folder.folder}/messages/$count`;
        const countResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ConsistencyLevel: "eventual",
          },
        });
        return { folder, count: countResponse.data };
      });

      const emailCounts = await Promise.all(emailCountsPromises);

      const emailCountsSummary: { [key: string]: number } = {};
      emailCounts.forEach(({ folder, count }) => {
        emailCountsSummary[folder.value] = count;
      });

      return response.status(ResponseStatus.Success).json({
        message: ResponseMessages.Success,
        emailCounts: emailCountsSummary,
        userProfile,
        userName,
      });
    } catch (error) {
      console.error("Error fetching email counts:", error);
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: ResponseMessages.InternalServerError });
    }
  }

  public static async replyToEmail(request: Request, response: Response) {
    try {
      const accessToken = request.user?.oAuthAccessToken;
      if (!accessToken) {
        return response
          .status(ResponseStatus.BadRequest)
          .json({ message: "An access token is required." });
      }

      const validatedData = replyEmailSchema.parse(request.body);
      const { messageId, comment } = validatedData;

      const emailReplyData = {
        comment: comment || "",
      };

      const url = `${EmailController.GRAPH_API_BASE_URL}/me/messages/${messageId}/reply`;
      const apiResponse = await axios.post(url, emailReplyData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (apiResponse.status === 202) {
        return response
          .status(ResponseStatus.Success)
          .json({ message: ResponseMessages.Success });
      } else {
        throw new Error("Failed to send email reply.");
      }
    } catch (error) {
      console.error("Error replying to email:", error);
      if (error instanceof z.ZodError) {
        return response
          .status(ResponseStatus.BadGateway)
          .json({ message: error.errors[0].message });
      }
      return response
        .status(ResponseStatus.InternalServerError)
        .json({ message: "An unexpected error occurred." });
    }
  }
}

export default EmailController;
