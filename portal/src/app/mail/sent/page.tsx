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

export default function Sent() {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ScrollArea className="flex h-full w-full flex-col space-y-2 rounded-md p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() => {
              return (
                <Card className="mt-2 w-full" key="1">
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
          <div className="flex h-full flex-col items-center">
            <div className="w-full p-4 h-16 border-b-[1px]">
              asldjgh
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
