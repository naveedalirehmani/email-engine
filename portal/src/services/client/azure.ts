import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import AzureMailService from "../azure.service";
import { CustomAxiosError } from "../api";
import { useState } from "react";
import { Endpoints } from "@/types/endpoint";

// keeping seperate hooks for all pages, for any future computed properties.

export function useGetPrimaryMail() {
  const query = useQuery({
    queryKey: [Endpoints.PRIMARY],
    queryFn: AzureMailService.getPrimaryMails,
  });
  return query;
}

export function useTrashMail() {
  const query = useQuery({
    queryKey: [Endpoints.TRASH],
    queryFn: AzureMailService.getTrashMails,
  });

  return query;
}

export function useSentMail() {
  const query = useQuery({
    queryKey: [Endpoints.SENT],
    queryFn: AzureMailService.getSentMail,
  });

  return query;
}

export function useJunkMail() {
  const query = useQuery({
    queryKey: [Endpoints.JUNK],
    queryFn: AzureMailService.getJunkMails,
  });

  return query;
}

export function useMailSummary() {
  const query = useQuery({
    queryKey: ["mailSummary"],
    queryFn: AzureMailService.getMailSummary,
  });

  return query;
}

export function usePostEmail() {
  const { toast } = useToast();
  const [isFormLoading, setFormLoading] = useState(false);

  const mutation = useMutation({
    mutationKey: [Endpoints.SEND],
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
    mutationKey: [Endpoints.REPLY],
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
