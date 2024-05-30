"use client";

import { Navbar } from "./ui/nav";

type Props = { children: React.ReactNode };

import { MailIcon, Send, Trash, Archive } from "lucide-react";
import { routes } from "@/types/routes";

export default function SideNavbar({ children }: Props) {
  return (
    <div>
      <Navbar
        links={[
          {
            title: "Primary",
            href: routes.primary,
            icon: <MailIcon className="h-5 w-5" />,
          },
          {
            title: "Sent",
            href: routes.sent,
            icon: <Send className="h-5 w-5" />,
          },
          {
            title: "Trash",
            href: routes.trash,
            icon: <Trash className="h-5 w-5" />,
          },
          {
            title: "Junk",
            href: routes.junk,
            icon: <Archive className="h-5 w-5" />,
          },
        ]}
      >
        {children}
      </Navbar>
    </div>
  );
}
