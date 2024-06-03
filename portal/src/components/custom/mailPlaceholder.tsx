import Image from "next/image";
import React from "react";

type Props = {};

function MailPlaceHolder({}: Props) {
  return (
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
  );
}

export default MailPlaceHolder;
