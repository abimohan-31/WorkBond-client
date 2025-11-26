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
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignUpProvider } from "@/services/ProviderSignUp";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, "Name must be atleast 3 characters"),
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
  phone: z
    .string()
    .regex(
      /^(\+94\s?|0)?7[0-9]{1}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/,
      "Please enter a valid phone number (e.g., 077 123 4567 or +94 77 123 4567)"
    ),
  address: z.string().min(1, {
    message: "Address is required",
  }),
  experience_years: z.number({
    message: "Experience years is required",
  }),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
});

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      experience_years: 1,
      skills: [],
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      console.log("Submitting form data:", data);

      const res = await SignUpProvider(data);
      console.log("API Response:", res);

      if (res.success && res.statusCode === 201) {
        toast.success(
          "You registered successfully! Please wait for the admin approval."
        );

        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong during registration"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <Image src="/noBgColor.svg" alt="logo" width={200} height={150} />
          <CardTitle>Register as a Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-name">Name </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your Name"
                      autoComplete="off"
                    />
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
                    <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
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
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-name">Phone </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your Phone Number"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-name">
                      Address{" "}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your Address"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="experience_years"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-experience">
                      Experience Years{" "}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-experience"
                      type="number"
                      min="1"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your experience in years"
                      autoComplete="off"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="skills"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Skills</FieldLabel>

                    <div className="border rounded-md px-3 py-2 cursor-pointer">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full text-left">
                          {field.value.length > 0
                            ? field.value.join(", ")
                            : "Select skills"}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56">
                          {[
                            "Plumbing",
                            "Painting",
                            "Cleaning",
                            "Electrician",
                            "Carpentry",
                            "Gardening",
                          ].map((skill) => (
                            <DropdownMenuCheckboxItem
                              key={skill}
                              checked={field.value.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, skill]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (s: string) => s !== skill
                                    )
                                  );
                                }
                              }}
                            >
                              {skill}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

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
              Register
            </Button>
          </Field>
          <p>
            Already have an account? <Link href="/auth/login"> Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
