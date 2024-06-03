"use client";

import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useGetPrimaryMail } from "@/services/client/azure";
import MailSkeleton from "@/components/custom/skeleton/mailSkeleton";
import { SearchBar } from "@/components/custom/EmailSearchBar";
import { EmailList } from "@/components/custom/EmailList";
import { EmailDetail } from "@/components/custom/EmailDetail";
import { Email } from "@/types/types";
import { useFilteredEmails } from "@/hooks/useFilteredEmails";
import MailPlaceHolder from "@/components/custom/mailPlaceholder";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  const { data, isLoading, isError, isRefetching, refetch } =
    useGetPrimaryMail();

  const filteredEmails = useFilteredEmails({ data, filterText });

  if (isLoading || isRefetching) {
    return <MailSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center">
        Cannot fetch Mails, something went wrong...
      </div>
    );
  }

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
  };

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={30} minSize={20}>
          <SearchBar
            filterText={filterText}
            setFilterText={setFilterText}
            refetch={refetch}
          />
          <EmailList emails={filteredEmails} onEmailClick={handleEmailClick} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={40}>
          {selectedEmail ? (
            <EmailDetail email={selectedEmail} />
          ) : (
            <MailPlaceHolder/>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
