import { useMutation } from "@tanstack/react-query";
import { loginHandler } from "../adminService";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CustomAxiosError } from "../api";
import { useRouter } from "next/navigation";

export function useSignInMutation() {
  const router = useRouter();
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: loginHandler,
    onSuccess: (response) => {
      setFormLoading(false);
      toast({
        title: "Log in Sucess",
        variant: "sucess",
      });
      // console.log(response,'response')
      // router.push('/mail');
      // return
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
