import { Router } from "express";
const AuthenticationRouter = Router();

import {
  signupHandler,
  loginHandler,
  logoutHandler,
} from "../../controller/authentication/authentication.controller";
import oauthAuthentication from "./oauth/oauth.router";

AuthenticationRouter.post("/sign-up", signupHandler);
AuthenticationRouter.post("/login", loginHandler);
AuthenticationRouter.post("/admin/login", loginHandler);
AuthenticationRouter.get("/logout", logoutHandler);

AuthenticationRouter.use("/oauth", oauthAuthentication);

export default AuthenticationRouter;
