import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as azure from "../azure.service";
// import { queryClient } from "@/lib/react-query-provider";
import { CustomAxiosError } from "../api";
import { useRouter } from "next/router";
import { useState } from "react";

export function useGetPrimaryMail() {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["primaryMail"],
    queryFn: azure.getPrimaryMails,
  });

  return query;
}
export function useTrashMail() {
  const query = useQuery({
    queryKey: ["trashMail"],
    queryFn: azure.getTashMails,
  });

  return query;
}
export function useSentMail() {
  const query = useQuery({
    queryKey: ["sentMail"],
    queryFn: azure.getSentMail,
  });

  return query;
}
export function useJunkMail() {
  const query = useQuery({
    queryKey: ["junkMail"],
    queryFn: azure.getJunkMails,
  });

  return query;
}

export function usePostEmail() {
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: azure.sendMail,
    onSuccess: (response) => {
      setFormLoading(false);
      toast({
        title: "Email Was Sent",
        variant: "sucess",
      });
      console.log(response,'response')
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