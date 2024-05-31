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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePostEmail } from "@/services/client/azure";
import { Loader2, Send } from "lucide-react";

const FormSchema = z.object({
  subject: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  toRecipients: z.string().email({
    message: "Invalid email address.",
  }),
  body: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
});

export default function Compose() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const {
    mutation: { mutate },
    formStatus: { isFormLoading, setFormLoading },
  } = usePostEmail();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data, "data");
    setFormLoading(true);
    mutate(data);
  }

  return (
    <div className="flex justify-center p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 md:w-[800px]"
        >
          <FormField
            control={form.control}
            name="toRecipients"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="Wills@google.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Your email Subject Here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here."
                    {...field}
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isFormLoading}>
            {isFormLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin " />
            ) : (
              <Send size={20} className="mr-2"></Send>
            )}
            Send Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
