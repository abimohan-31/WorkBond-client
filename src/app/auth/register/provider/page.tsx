"use client";

import { useState } from "react";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, X } from "lucide-react";
import { authService } from "@/services/auth.service";
import { SKILLS_LIST } from "@/lib/constants";

const registerProviderSchema = z
  .object({
    name: z
      .string()
      .min(1, "name is required")
      .refine((val) => val.trim().length >= 3, {
        message: "name must be at least 3 letters",
      }),
    email: z
      .string()
      .min(1, "email is required")
      .refine((val) => val.includes("@"), {
        message: "invalid email address",
      }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(10, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    experience_years: z
      .string()
      .min(1, "experience year is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: "Experience must be a positive number",
      }),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterProviderFormValues = z.infer<typeof registerProviderSchema>;

export default function RegisterProviderPage() {
  const router = useRouter();
  const form = useForm<RegisterProviderFormValues>({
    resolver: zodResolver(registerProviderSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      experience_years: "",
      skills: [],
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");

  const onSubmit = async (data: RegisterProviderFormValues) => {
    try {
      const result = await authService.register({
        ...data,
        experience_years: Number(data.experience_years),
        role: "provider",
        skills: data.skills,
      });

      if (!result.success) {
        throw new Error(
          result.message || result.error || "Registration failed"
        );
      }

      toast.success(
        "Registration successful! Please wait for admin approval to log in."
      );
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addSkill = () => {
    if (!selectedSkill) return;
    const currentSkills = form.getValues("skills");
    if (!currentSkills.includes(selectedSkill)) {
      form.setValue("skills", [...currentSkills, selectedSkill]);
    }
    setSelectedSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove)
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/40 via-background to-primary/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold text-[#0B204C]">
              Become a Provider
            </h1>
            <p className="text-muted-foreground">
              Join our network of trusted professionals and grow with WorkBond.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Work Bond" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="workbond@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="0771234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vavuniya">Vavuniya</SelectItem>
                        <SelectItem value="Killinochchi">
                          Killinochchi
                        </SelectItem>
                        <SelectItem value="Mannar">Mannar</SelectItem>
                        <SelectItem value="Jaffna">Jaffna</SelectItem>
                        <SelectItem value="Mullaitivu">Mullaitivu</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Skills</FormLabel>
                <div className="flex gap-2">
                  <Select
                    value={selectedSkill}
                    onValueChange={setSelectedSkill}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKILLS_LIST.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addSkill} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("skills").map((skill) => (
                    <div
                      key={skill}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <FormMessage>
                  {form.formState.errors.skills?.message}
                </FormMessage>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Register as Provider
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm lg:text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline hover:text-primary">
              Log in
            </Link>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-auto">
          <Image
            src="https://images.pexels.com/photos/13443796/pexels-photo-13443796.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Provider registration"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
