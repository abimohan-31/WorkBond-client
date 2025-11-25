"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import Image from "next/image";

const formSchema = z.object({
  role: z.enum(["admin", "customer", "provider"], {
    message: "Role is required",
  }),
  email: z
    .email({ message: "email is required" })
    .regex(
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i
    ),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be atleast 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export default function UserNewEditView() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "customer",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.success("You login successfully");
  }

  return (
    <dialog>
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <Image src="/noBgColor.svg" alt="logo" width={200} height={150} />
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Role</FieldLabel>

                      <select
                        {...field}
                        className="border rounded-md p-2 w-full"
                      >
                        <option value="">Choose your role</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                        <option value="provider">Provider</option>
                      </select>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-email">
                        Email
                      </FieldLabel>
                      <InputGroup>
                        <Input
                          {...field}
                          id="form-rhf-demo-email"
                          placeholder="Enter your email"
                          // rows={6}
                          className="min-h-2 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-name">
                        Password{" "}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your Password"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button type="submit" form="form-rhf-demo">
                Login
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </dialog>
  );
}
