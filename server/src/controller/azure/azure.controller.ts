import { Request, Response } from "express";
import axios from "axios";
import {
  ResponseStatus,
  ResponseMessages,
} from "../../types/enums/responseEnums";
import { replyEmailSchema, sendEmailSchema } from "../../schema/validation";
import { z } from "zod";

const GRAPH_API_BASE_URL = "https://graph.microsoft.com/v1.0";

async function fetchEmails(
  folder: string,
  accessToken: string,
): Promise<any[]> {
  const url = `${GRAPH_API_BASE_URL}/me/mailFolders/${folder}/messages?$select=subject,from,isRead,receivedDateTime,bodyPreview,body`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.value;
}

// async function fetchSenderPhoto(
//   senderEmail: string,
//   accessToken: string,
// ): Promise<string | null> {
//   try {
//     const url = `${GRAPH_API_BASE_URL}/users/${senderEmail}/photo/$value`;
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       responseType: "arraybuffer",
//     });
//     const base64Image = Buffer.from(response.data, "binary").toString("base64");
//     return `data:image/jpeg;base64,${base64Image}`;
//   } catch (error) {
//     console.error("Error fetching sender photo:", error);
//     return null;
//   }
// }

// async function enrichEmailsWithSenderPhoto(
//   emails: any[],
//   accessToken: string,
// ): Promise<any[]> {
//   const enrichedEmails = await Promise.all(
//     emails.map(async (email) => {
//       const senderEmail = email.from.emailAddress.address;
//       const senderPhoto = await fetchSenderPhoto(senderEmail, accessToken);
//       return { ...email, senderPhoto };
//     }),
//   );
//   return enrichedEmails;
// }

export async function getPrimaryEmails(request: Request, response: Response) {
  try {
    const accessToken = request.user?.oAuthAccessToken;
    if (!accessToken) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "An access token is required." });
    }
    const emails = await fetchEmails("inbox", accessToken);
    // const enrichedEmails = await enrichEmailsWithSenderPhoto(
    //   emails,
    //   accessToken,
    // );

    return response
      .status(ResponseStatus.Success)
      .json({ message: ResponseMessages.Success, emails: emails });
  } catch (error) {
    console.error("Error fetching primary emails:", error);
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: "An unexpected error occurred." });
  }
}

export async function getJunkEmails(request: Request, response: Response) {
  try {
    const accessToken = request.user?.oAuthAccessToken;
    if (!accessToken) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "An access token is required." });
    }
    const emails = await fetchEmails("junkemail", accessToken);
    // const enrichedEmails = await enrichEmailsWithSenderPhoto(
    //   emails,
    //   accessToken,
    // );

    return response
      .status(ResponseStatus.Success)
      .json({ message: ResponseMessages.Success, emails: emails });
  } catch (error) {
    console.error("Error fetching junk emails:", error);
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: "An unexpected error occurred." });
  }
}

export async function getTrashEmails(request: Request, response: Response) {
  try {
    const accessToken = request.user?.oAuthAccessToken;
    if (!accessToken) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "An access token is required." });
    }
    const emails = await fetchEmails("deleteditems", accessToken);
    // const enrichedEmails = await enrichEmailsWithSenderPhoto(
    //   emails,
    //   accessToken,
    // );

    return response
      .status(ResponseStatus.Success)
      .json({ message: ResponseMessages.Success, emails: emails });
  } catch (error) {
    console.error("Error fetching trash emails:", error);
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: "An unexpected error occurred." });
  }
}

export async function getSentEmails(request: Request, response: Response) {
  try {
    const accessToken = request.user?.oAuthAccessToken;
    if (!accessToken) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "An access token is required." });
    }
    const emails = await fetchEmails("sentitems", accessToken);
    // const enrichedEmails = await enrichEmailsWithSenderPhoto(
    //   emails,
    //   accessToken,
    // );

    return response
      .status(ResponseStatus.Success)
      .json({ message: ResponseMessages.Success, emails: emails });
  } catch (error) {
    console.error("Error fetching sent emails:", error);
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: "An unexpected error occurred." });
  }
}

export async function sendEmail(request: Request, response: Response) {
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

    const url = `${GRAPH_API_BASE_URL}/me/sendMail`;
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

export async function getTotalEmailCount(request: Request, response: Response) {
  try {
    const accessToken = request.user?.oAuthAccessToken;
    if (!accessToken) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "An access token is required." });
    }

    const profileUrl = `${GRAPH_API_BASE_URL}/me`;
    const profileResponse = await axios.get(profileUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userProfile = profileResponse.data;
    const userName = userProfile.displayName;

    const profilePictureUrl = `${GRAPH_API_BASE_URL}/me/photo/$value`;
    let userProfilePicture = null;
    try {
      const pictureResponse = await axios.get(profilePictureUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer",
      });
      const base64Image = Buffer.from(pictureResponse.data, "binary").toString(
        "base64",
      );
      userProfilePicture = `data:image/jpeg;base64,${base64Image}`;
    } catch (pictureError) {
      console.error("Error fetching profile picture:", pictureError);
      userProfilePicture = null;
    }

    const folderNames = [
      { folder: "inbox", value: "/mail" },
      { folder: "junkemail", value: "/mail/junk" },
      { folder: "deleteditems", value: "/mail/trash" },
      { folder: "sentitems", value: "/mail/sent" },
    ];
    const emailCountsPromises = folderNames.map(async (folder) => {
      const url = `${GRAPH_API_BASE_URL}/me/mailFolders/${folder.folder}/messages/$count`;
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
      userProfilePicture,
    });
  } catch (error) {
    console.error("Error fetching email counts:", error);
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: ResponseMessages.InternalServerError });
  }
}

export async function replyToEmail(request: Request, response: Response) {
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

    const url = `${GRAPH_API_BASE_URL}/me/messages/${messageId}/reply`;
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
