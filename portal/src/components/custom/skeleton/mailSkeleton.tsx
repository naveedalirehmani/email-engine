import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

function MailSkeleton({}: Props) {
  return (
    <div className="h-[calc(100vh-120px)]">
      <ResizablePanelGroup direction="horizontal" className=" w-full">
        <ResizablePanel defaultSize={30} minSize={20} className="p-4">
          {[1, 2, 3, 4, 5, 6, 7].map(() => {
            return (
              <div className="flex flex-col space-y-3 pt-2" key="1">
                <Skeleton className="h-[125px] w-full rounded-xl" />
              </div>
            );
          })}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={20} className="p-6">
          <div className="flex flex-col space-y-3 w-full">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[450px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <Skeleton className="h-[600px] rounded-xl" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MailSkeleton;
