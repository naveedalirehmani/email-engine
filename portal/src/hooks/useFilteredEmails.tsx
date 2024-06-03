import { useEffect, useState } from "react";
import { Email } from "@/types/types";

interface UseFilteredEmailsProps {
  data: { data: { emails: Email[] } } | undefined;
  filterText: string;
}

export function useFilteredEmails({ data, filterText }: UseFilteredEmailsProps) {
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);

  useEffect(() => {
    if (data?.data.emails) {
      const emails: Email[] = data.data.emails;
      if (filterText.trim() === "") {
        setFilteredEmails(emails);
      } else {
        const filtered = emails.filter((email) =>
          email.subject.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredEmails(filtered);
      }
    }
  }, [data, filterText]);

  return filteredEmails;
}
