"use client";

import Link from "next/link";
import {
  CircleUser,
  LogOutIcon,
  MailSearch,
  Menu,
  Moon,
  SunMoon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMailSummary } from "@/services/client/azure";
import { useLogout } from "@/services/client/auth";
import { useEffect } from "react";
import { mailSocket } from "@/services/socket/socket";

type EmailCountRoutes =
  | "/mail"
  | "/mail/junk"
  | "/mail/trash"
  | "/mail/sent"
  | "/mail/compose";

type Props = {
  children: React.ReactNode;
  links: {
    title: string;
    href: EmailCountRoutes;
    icon: any;
  }[];
};

interface summary {
  emailCounts: {
    "/mail/compose": number;
    "/mail": number;
    "/mail/junk": number;
    "/mail/trash": number;
    "/mail/sent": number;
  };
}

export function Navbar({ children, links }: Props) {
  const pathName = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = theme === "light";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const tab = () => {
    const parts = pathName.split("/");
    if (parts[2]) return parts[2];
    else return "primary";
  };

  useEffect(() => {
    mailSocket.on("connected", connected);
    return () => {
      mailSocket.off("connected");
    };
  }, []);

  // need to setup.
  function connected(value: any) {}

  const {
    mutation: { mutate },
  } = useLogout();
  const { data, isLoading, isError } = useMailSummary();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <MailSearch className="animate-bounce" size={100} strokeWidth={1} />
        <p className="text-gray-700 text-xl">Searching for mails.</p>
      </div>
    );
  }

  if (isError) {
    return <div>Cannot fetch summary..</div>;
  }

  const result: summary = data?.data;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/90 dark:bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            {/* <Link href="/" className="flex items-center gap-2 font-semibold">
              <Mail />
              <span className="">Email Engine</span>
            </Link> */}
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Email Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="outlook" defaultChecked>
                    Outlook
                  </SelectItem>
                  <SelectItem value="gmail" disabled>
                    Gmail | Coming Soon...
                  </SelectItem>
                  <SelectItem value="yahoo" disabled>
                    Yahoo | Coming Soon...
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {links.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "my-1 mr-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
                      {
                        "bg-primary text-white dark:text-black":
                          item.href == pathName,
                      },
                    )}
                  >
                    <span className="flex items-center justify-center">
                      <span className="mr-2">{item.icon}</span>
                      {item.title}
                    </span>
                    <span className="ml-auto rounded-full text-center">
                      {result.emailCounts[item.href]}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/90 dark:bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                {links.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
            <h1 className="text-xl font-semibold capitalize">{tab()}</h1>
          </Sheet>
          <div className="w-full flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  mutate();
                }}
              >
                <LogOutIcon className="mr-2" size={18} />
                <span>Logout</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {" "}
                <>
                  {isActive ? (
                    <span className="flex cursor-pointer items-center">
                      <Moon className="mr-2" size={18} />
                      Dark
                    </span>
                  ) : (
                    <span className="flex cursor-pointer items-center">
                      <SunMoon className="mr-2" size={18} />
                      Light
                    </span>
                  )}
                </>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex max-h-screen flex-1 flex-col gap-4 lg:gap-6">
          {children}
          <div className="mt-auto flex h-8 items-center justify-center border-t-[1px] bg-muted/90 dark:bg-muted/40 text-xs text-gray-400">
            all your mails at one place ❤️
          </div>
        </main>
      </div>
    </div>
  );
}
