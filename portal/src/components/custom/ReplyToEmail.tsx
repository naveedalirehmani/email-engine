"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useReplyToEmail } from "@/services/client/azure";

const ReplyFormSchema = z.object({
  comment: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
});

interface ReplyToEmailProps {
  messageId: string;
  from: string;
}

export default function ReplyToEmail({ messageId, from }: ReplyToEmailProps) {
  const form = useForm<z.infer<typeof ReplyFormSchema>>({
    resolver: zodResolver(ReplyFormSchema),
  });

  const {
    mutation: { mutate },
    formStatus: { isFormLoading, setFormLoading },
  } = useReplyToEmail();

  function onSubmit(data: z.infer<typeof ReplyFormSchema>) {
    setFormLoading(true);
    mutate({ messageId, ...data });
  }

  return (
    <div className="flex justify-center p-4 border-t-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 flex flex-col items-end"
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder={`Reply to ${from}`}
                    {...field}
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isFormLoading}>
            {isFormLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Send size={16} className="mr-2"></Send>
            )}
            Send Reply
          </Button>
        </form>
      </Form>
    </div>
  );
}
