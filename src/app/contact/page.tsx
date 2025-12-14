"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";
import { Mail, Phone, MapPin, Loader2, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiClient.post("/contact", {
        name: data.name,
        email: data.email,
        message: data.message,
      });

      if (response.data?.success) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.reset();
      } else {
        throw new Error(response.data?.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send message. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have a question or need assistance? We're here to help. Send us a message 
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get In Touch
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We're here to help and answer any questions you might have. 
                We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    Ukkulankulam, Vavuniya, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone Number</h3>
                  <p className="text-muted-foreground">
                    +94-XXX-XXX-XXXX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">E-Mail</h3>
                  <p className="text-muted-foreground">
                    abimohanuki@gmail.com
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold text-lg mb-4">Follow Us:</h3>
              <div className="flex gap-4">
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6 text-primary-foreground" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6 text-primary-foreground" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6 text-primary-foreground" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/90 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-6 w-6 text-primary-foreground" />
                </a>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Send a Message
              </h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to the processing of your personal data 
                    by WorkBond as described in the Privacy Statement.
                  </p>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 rounded-xl overflow-hidden shadow-lg" style={{ height: "450px" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.1234567890123!2d80.4975!3d8.7514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDUnMDUuMCJOIDgwwrAyOSc1MS4wIkU!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="WorkBond Location"
          />
        </div>
      </div>
    </main>
  );
}
