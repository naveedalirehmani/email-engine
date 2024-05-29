"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSignInMutation } from "@/services/client/auth";
import { Loader2 } from "lucide-react";

export default function LoginAccount() {
  const {
    mutation: { mutate: signInWithOutlook },
    formStatus: { setFormLoading, isFormLoading },
  } = useSignInMutation();

  const loginWithOutlook = () => {
    setFormLoading(true);
    signInWithOutlook();
  };

  return (
    <div className="min-h-screen w-full border-2 lg:grid lg:grid-cols-2">
      <div className="hidden flex-col items-center justify-center bg-muted lg:flex">
        <h1 className="text-4xl font-bold">Email Engine</h1>
        <p className="tex-gray-600">manage all your mail at one place!!</p>
      </div>
      <div className="flex min-h-screen items-center justify-center border-2">
        <Card className="min-h-[400px] w-[350px] md:w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Sign in</CardTitle>
            <CardDescription className="text-center">
              Please sign in to your email provider...
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              onClick={loginWithOutlook}
              disabled={isFormLoading}
              className="w-full"
              variant="outline"
            >
              {isFormLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Login With Outlook
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
