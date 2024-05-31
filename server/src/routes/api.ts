import { Router } from "express";
const Api1 = Router();

import helloRouter from "./hello/hello.router";
import authentication from "./authentication/authentication.router";
import MailRouter from "./mail/mail.router";
import protectedRouter from "./protected/protected.router";

//health route.
Api1.use("/health", helloRouter);

// example protected routes, role based.
Api1.use("/protected", protectedRouter);

// authentication routes, cookie and oAuth.
Api1.use("/authentication", authentication);

Api1.use("/mail-data", MailRouter);

export = Api1;
