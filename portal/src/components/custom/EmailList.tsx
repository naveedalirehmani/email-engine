import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, truncateText } from "@/lib/utils";
import { Email } from "@/types/types";

interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  selectedEmail: Email | null;
}

export function EmailList({
  emails,
  onEmailClick,
  selectedEmail,
}: EmailListProps) {
  return (
    <ScrollArea className="flex h-[calc(100vh-240px)] w-full flex-col space-y-2 rounded-md p-4 pt-0">
      {emails.length > 0 ? (
        emails.map((email) => (
          <Card
            className={cn("mt-2 w-full cursor-pointer", {
              "bg-muted/90": selectedEmail?.id == email.id,
            })}
            key={email.id}
            onClick={() => onEmailClick(email)}
          >
            <CardHeader className="p-4 pb-0 ">
              <CardTitle className="text-md flex items-center justify-between">
                <span>{email.from.emailAddress.name}</span>
                <span className="text-xs font-medium text-gray-500">
                  {new Date(email.receivedDateTime).toLocaleDateString()}
                </span>
              </CardTitle>
              <CardDescription className="mt-0 text-primary">
                {email.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-gray-400">
              <p>{truncateText(email.bodyPreview, 100)}</p>
            </CardContent>
            <CardFooter className="space-x-2">
              {email.isRead ? (
                <Badge variant="outline">Read</Badge>
              ) : (
                <Badge>Unread</Badge>
              )}
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="p-4 text-center">No emails found.</div>
      )}
    </ScrollArea>
  );
}
