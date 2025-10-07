"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import useTranslation from "@/hooks/useTranslation";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignIn() {
  const { t } = useTranslation()
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const urlError = searchParams.get("error");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    console.log("🚀 ~ handleSubmit ~ formData:", formData)
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log('🚀 Attempting login with:', email);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('SignIn error:', result.error);
        setError("Invalid email or password");
      } else if (result?.ok) {
        console.log('SignIn successful, redirecting...');
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error('Exception during signin:', error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="md:mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(error || urlError) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">
                {error || "Invalid email or password"}
              </div>
            </div>
          )}
          <div className="flex gap-4 flex-col">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="test@example.com"
                placeholder="Email address"
                className='rounded-md'
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className='rounded-md'
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? `${t('signIn')}...` : t('signIn')}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <Link
            href='/'
            className='font-medium w-full flex justify-center hover:underline items-center text-blue-600 hover:text-blue-500'
          >
            {t('back_to_home')}
          </Link>
          <p className="mb-2 font-semibold text-gray-800">
            Demo Credentials
          </p>
          <p>
            Email: <code className="bg-gray-100 px-2 py-1 rounded text-xs">test@example.com</code>
          </p>
          <p>
            Password: <code className="bg-gray-100 px-2 py-1 rounded text-xs">password</code>
          </p>
        </div>
      </div>
    </div>
  );
}
