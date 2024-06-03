import React from "react";
import Image from "next/image";
import EmailContent from "@/components/custom/emailContent";
import { Email } from "@/types/types";
import ReplyToEmail from "./ReplyToEmail";

interface EmailDetailProps {
  email: Email;
}

export function EmailDetail({ email }: EmailDetailProps) {
  return (
    <div className="h-full">
      <div className="flex space-x-4 border-b-2 p-4">
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <Image
            src="/profile_placeholder.jpg"
            className="h-12 w-12"
            alt="Image"
            width="40"
            height="40"
          ></Image>
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <span>{email.from.emailAddress.name}</span>
            <span className="text-xs font-medium text-gray-500">
              {new Date(email.receivedDateTime).toLocaleString()}
            </span>
          </div>
          <p className="subject text-xs text-gray-700 dark:text-gray-400">
            {email.subject}
          </p>
          <p className="from text-xs text-gray-700 dark:text-gray-400">
            <span className="font-semibold">From :</span>{" "}
            {email.from.emailAddress.address}
          </p>
        </div>
      </div>
      <div className="h-[calc(100vh-380px)] overflow-scroll p-4">
        <p className="mail text-gray-700 dark:text-white">
          <EmailContent content={email.body.content}></EmailContent>
        </p>
      </div>
      <div>
        <ReplyToEmail messageId={email.id} from={email.from.emailAddress.name}/>
      </div>
    </div>
  );
}
