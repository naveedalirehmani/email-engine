import { Router } from "express";

import {
  getPrimaryEmails,
  getJunkEmails,
  getTrashEmails,
  getSentEmails,
  sendEmail,
} from "../../../controller/azure/azure.controller";

const AzureRouter = Router();

AzureRouter.post("/send", (request, response) => sendEmail(request, response));

AzureRouter.get("/primary", (request, response) =>
  getPrimaryEmails(request, response),
);

AzureRouter.get("/junk", (request, response) =>
  getJunkEmails(request, response),
);

AzureRouter.get("/trash", (request, response) =>
  getTrashEmails(request, response),
);

AzureRouter.get("/sent", (request, response) =>
  getSentEmails(request, response),
);

export default AzureRouter;
