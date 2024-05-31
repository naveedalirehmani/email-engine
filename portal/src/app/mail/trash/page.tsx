"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { RefreshCcw, Search } from "lucide-react";
import Image from "next/image";
import { useGetPrimaryMail, useTrashMail } from "@/services/client/azure";
import MailSkeleton from "@/components/custom/skeleton/mailSkeleton";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query-provider";
import EmailContent from "@/components/custom/emailContent";
import { truncateText } from "@/lib/utils";

// Define TypeScript types
interface Email {
  id: string;
  receivedDateTime: string;
  subject: string;
  bodyPreview: string;
  isRead: boolean;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  body: {
    content: string;
  };
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const { data, isLoading, isError, isRefetching, refetch } =
    useTrashMail();

  useEffect(() => {
    if (data?.data.emails) {
      const emails: Email[] = data.data.emails;
      if (filterText.trim() === "") {
        setFilteredEmails(emails);
      } else {
        const filtered = emails.filter((email) =>
          email.subject.toLowerCase().includes(filterText.toLowerCase()),
        );
        setFilteredEmails(filtered);
      }
    }
  }, [data, filterText]);

  if (isLoading || isRefetching) {
    return <MailSkeleton />;
  }

  if (isError) {
    return <div>Cannot fetch Mails, something went wrong...</div>;
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
  };

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="p-4 pb-0">
            <div
              className="flex cursor-text items-center rounded-lg border-2 px-2"
              onClick={handleDivClick}
            >
              <Search className="text-gray-500" size={20}></Search>
              <Input
                ref={inputRef}
                className="border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Search"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              ></Input>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 pb-0 capitalize">
            <p>All Mails</p>
            <Button onClick={() => refetch()} variant="ghost">
              <RefreshCcw size={16} className="mr-2"></RefreshCcw>
              Refresh
            </Button>
          </div>
          <ScrollArea className="flex h-[calc(100vh-240px)] w-full flex-col space-y-2 rounded-md p-4 pt-0">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <Card
                  className="mt-2 w-full cursor-pointer"
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                >
                  <CardHeader className="p-4 pb-0">
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
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={40}>
          {selectedEmail ? (
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
                    <span>{selectedEmail.from.emailAddress.name}</span>
                    <span className="text-xs font-medium text-gray-500">
                      {new Date(
                        selectedEmail.receivedDateTime,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <p className="subject text-xs text-gray-700 dark:text-gray-400">
                    {selectedEmail.subject}
                  </p>
                  <p className="from text-xs text-gray-700 dark:text-gray-400">
                    <span className="font-semibold">From :</span>{" "}
                    {selectedEmail.from.emailAddress.address}
                  </p>
                </div>
              </div>
              <div className="h-[calc(100vh-240px)] overflow-scroll p-4">
                <p className="mail text-gray-700 dark:text-white">
                  <EmailContent
                    content={selectedEmail.body.content}
                  ></EmailContent>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-[800px] w-full flex-col justify-center p-4">
              <p className="mt-4 text-lg">
                Select an email to view its details
              </p>
              <Image
                src="/bg.svg"
                alt="Image"
                width="1920"
                height="1080"
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
