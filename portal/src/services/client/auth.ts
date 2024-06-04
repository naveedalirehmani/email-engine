import { useMutation } from "@tanstack/react-query";
import userService from "../user.service";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CustomAxiosError } from "../api";
import { useRouter } from "next/navigation";
import { mailSocket } from "../socket/socket";

export function useSignInMutation() {
  const router = useRouter()
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: userService.loginHandler,
    onSuccess: (response) => {
      setFormLoading(false);
      // toast({
      //   title: "Log in Sucess",
      //   variant: "sucess",
      // });
      // console.log(response,'response')
      // router.push('/mail');
      // return
      // try {
      //   mailSocket.connect();
      // } catch (error) {
      //   console.log(error, "socket");
      // }
      router.replace(response.data);
    },
    onError: (error: CustomAxiosError) => {
      setFormLoading(false);
      const message = error.response?.data?.message || error.message;
      toast({
        title: message,
        variant: "destructive",
      });
    },
  });
  return {
    mutation,
    formStatus: {
      isFormLoading,
      setFormLoading,
    },
  };
}

export function useLogout() {
  const router = useRouter();
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: userService.logoutHandler,
    onSuccess: (response) => {
      setFormLoading(false);
      toast({
        title: "logout Successful",
        variant: "sucess",
      });
      try {
        mailSocket.disconnect();
      } catch (error) {
        console.log(error, "close-socket");
      }
      router.push("/sign-in");
    },
    onError: (error: CustomAxiosError) => {
      setFormLoading(false);
      const message = error.response?.data?.message || error.message;
      toast({
        title: message,
        variant: "destructive",
      });
    },
  });
  return {
    mutation,
    formStatus: {
      isFormLoading,
      setFormLoading,
    },
  };
}
