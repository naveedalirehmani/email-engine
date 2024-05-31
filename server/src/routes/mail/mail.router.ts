import { Router } from "express";
const MailRouter = Router();

import AzureRouter from "./azure/azure.router";

MailRouter.use("/azure", AzureRouter);

export default MailRouter;
