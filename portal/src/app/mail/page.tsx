"use client";

import React, { useRef } from "react";
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
import { Search, SearchCheck } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const inputRef = useRef(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      //@ts-ignore
      inputRef.current.focus();
    }
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
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
              ></Input>
            </div>
          </div>
          <ScrollArea className="flex h-full w-full flex-col space-y-2 rounded-md p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() => {
              return (
                <Card className="mt-2 w-full cursor-pointer" key="1">
                  <CardHeader className="p-4">
                    <CardTitle className="text-md flex items-center justify-between">
                      <span>William Smith</span>
                      <span className="text-xs font-medium text-gray-500">
                        7 Months ago
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-0 text-primary">
                      Meeting tomorrow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-gray-400">
                    <p>
                      Hi, let&apos;s have a meeting tomorrow to discuss the
                      project. I&apos;ve been reviewing the project details and
                      have some ideas I&apos;d like to share. It&apos;s crucial
                      that we align on our next steps to ensure the
                      project&apos;s success. Please come prepared with any
                      questions or insights you may have. Looking forward to our
                      meeting! Best regards, William
                    </p>
                  </CardContent>
                  <CardFooter className="space-x-2">
                    <Badge variant="outline">meeting</Badge>
                    <Badge>Work</Badge>
                    <Badge variant="outline">important</Badge>
                  </CardFooter>
                </Card>
              );
            })}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={20}>
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
                <span>William Smith</span>
                <span className="text-xs font-medium text-gray-500">
                  Oct 22, 2023, 9:00:00 AM
                </span>
              </div>
              <p className="subject text-xs text-gray-700">Meeting Tomorrow</p>
              <p className="from text-xs text-gray-700">
                Reply-To: williamsmith@example.com
              </p>
            </div>
          </div>
          <div className="p-4">
            <p className="mail text-gray-700">
              Hi, let&apos;s have a meeting tomorrow to discuss the project.
              I&apos;ve been reviewing the project details and have some ideas
              I&apos;d like to share. It&apos;s crucial that we align on our
              next steps to ensure the project&apos;s success. Please come
              prepared with any questions or insights you may have. Looking
              forward to our meeting! Best regards, William
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
