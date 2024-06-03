import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import AzureMailService from "../azure.service";
import { CustomAxiosError } from "../api";
import { useState } from "react";

export function useGetPrimaryMail() {
  const query = useQuery({
    queryKey: ["primaryMail"],
    queryFn: AzureMailService.getPrimaryMails,
  });

  return query;
}
export function useTrashMail() {
  const query = useQuery({
    queryKey: ["trashMail"],
    queryFn: AzureMailService.getTrashMails,
  });

  return query;
}
export function useSentMail() {
  const query = useQuery({
    queryKey: ["sentMail"],
    queryFn: AzureMailService.getSentMail,
  });

  return query;
}
export function useJunkMail() {
  const query = useQuery({
    queryKey: ["junkMail"],
    queryFn: AzureMailService.getJunkMails,
  });

  return query;
}

export function usePostEmail() {
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: AzureMailService.sendMail,
    onSuccess: (response) => {
      setFormLoading(false);
      toast({
        title: "Email Was Sent",
        variant: "sucess",
      });
      console.log(response, "response");
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

export function useReplyToEmail() {
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: AzureMailService.replyMail,
    onSuccess: (response) => {
      setFormLoading(false);
      toast({
        title: "Email Was Sent",
        variant: "sucess",
      });
      console.log(response, "response");
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

export function useMailSummary() {
  const query = useQuery({
    queryKey: ["mailSummary"],
    queryFn: AzureMailService.getMailSummary,
  });

  return query;
}
