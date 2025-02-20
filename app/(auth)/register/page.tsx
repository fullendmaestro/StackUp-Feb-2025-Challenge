"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";

import { register, type RegisterActionState } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("Account already exists");
    } else if (state.status === "failed") {
      toast.error("Failed to create account");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      toast.success("Account created successfully");
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#E8F4FC] overflow-hidden flex items-center justify-center">
      <div className="flex h-full w-full items-center justify-center bg-[#E8F4FC]">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12 bg-[#E8F4FC] p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h3 className="text-2xl font-semibold text-gray-800">Sign Up</h3>
            <p className="text-sm text-gray-500">
              Create an account with your email and password
            </p>
          </div>
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
            <p className="text-center text-sm text-gray-600 mt-4">
              {"Already have an account? "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign in
              </Link>
              {" instead."}
            </p>
          </AuthForm>
        </div>
      </div>
    </div>
  );
}
