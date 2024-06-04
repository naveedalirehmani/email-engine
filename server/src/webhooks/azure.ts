import axios from "axios";

const GRAPH_API_BASE_URL = "https://graph.microsoft.com/v1.0";

export async function createSubscription(accessToken: string) {
  const subscriptionUrl = `${GRAPH_API_BASE_URL}/subscriptions`;
  const subscriptionData = {
    changeType: "created",
    notificationUrl: process.env.AZURE_WEB_HOOK_URL,
    resource: "me/mailFolders/inbox/messages",
    expirationDateTime: new Date(new Date().getTime() + 3600000).toISOString(), // 1 hour from now
    clientState: "YourClientStateValue",
  };

  const response = await axios.post(subscriptionUrl, subscriptionData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
