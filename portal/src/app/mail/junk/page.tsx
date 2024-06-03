"use client";

import React, { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useGetPrimaryMail, useJunkMail, useSentMail, useTrashMail } from "@/services/client/azure";
import MailSkeleton from "@/components/custom/skeleton/mailSkeleton";
import { SearchBar } from "@/components/custom/EmailSearchBar";
import { EmailList } from "@/components/custom/EmailList";
import { EmailDetail } from "@/components/custom/EmailDetail";
import Image from "next/image";
import { Email } from "@/types/types";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filterText, setFilterText] = useState<string>("");
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);

  const { data, isLoading, isError, isRefetching, refetch } = useJunkMail();

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
          <SearchBar filterText={filterText} setFilterText={setFilterText} refetch={refetch} />
          <EmailList emails={filteredEmails} onEmailClick={handleEmailClick} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={40}>
          {selectedEmail ? (
            <EmailDetail email={selectedEmail} />
          ) : (
            <div className="flex h-[800px] w-full flex-col justify-center p-4">
              <p className="mt-4 text-lg">Select an email to view its details</p>
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
