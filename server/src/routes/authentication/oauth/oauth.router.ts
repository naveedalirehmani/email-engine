import { Router } from "express";

import GoogleAuthController from "../../../controller/authentication/oauth/google.controller";
import OutlookAuthController from "../../../controller/authentication/oauth/outlook.controller";

const oAuthRouter = Router();

// oAuth google
oAuthRouter.get("/google", (request, response) =>
  GoogleAuthController.redirectToGoogleAuth(request, response),
);
//callback
oAuthRouter.get("/google/callback", (request, response) =>
  GoogleAuthController.handleGoogleCallback(request, response),
);

// oAuth facebook
oAuthRouter.post("/outlook", (request, response) =>
  OutlookAuthController.redirectToOutlookAuth(request, response),
);
//callback
oAuthRouter.get("/outlook/callback", (request, response) =>
  OutlookAuthController.handleOutlookCallback(request, response),
);

export default oAuthRouter;
