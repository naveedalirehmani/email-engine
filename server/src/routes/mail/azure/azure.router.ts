import { Router } from "express";

import AzureController from "../../../controller/azure/azure.controller";
import { rateLimiter } from "../../../utils/ratelimiter";

const AzureRouter = Router();

AzureRouter.post("/send", rateLimiter, AzureController.sendEmail);
AzureRouter.get("/primary", AzureController.getPrimaryEmails);
AzureRouter.get("/junk", AzureController.getJunkEmails);
AzureRouter.get("/trash", AzureController.getTrashEmails);
AzureRouter.get("/sent", AzureController.getSentEmails);
AzureRouter.get("/summary", AzureController.getTotalEmailCount);
AzureRouter.post("/reply", AzureController.replyToEmail);
AzureRouter.post("/notification", AzureController.notifications);

export default AzureRouter;
