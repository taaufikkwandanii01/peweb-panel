"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaSpinner, FaWhatsapp } from "react-icons/fa";

interface FormData {
  email: string;
  password: string;
  role: "developer" | "admin";
}

export default function LoginView() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    role: "developer",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleRoleChange = (role: "developer" | "admin"): void => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", {
        email: formData.email,
        role: formData.role,
      });

      const result = await authService.login(formData);

      console.log("Login result:", result);

      if (result.success && result.role) {
        // Login berhasil dan status approved
        // Gunakan window.location untuk hard refresh
        const dashboardPath =
          result.role === "admin" ? "/admin/dashboard" : "/developer/dashboard";

        console.log("Redirecting to:", dashboardPath);

        // Small delay untuk memastikan session tersimpan
        setTimeout(() => {
          window.location.href = dashboardPath;
        }, 100);
      } else {
        // Login gagal - tampilkan error
        setError(result.message || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An unexpected error occurred during login");
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Peweb Panel
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange("developer")}
                disabled={loading}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  formData.role === "developer"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Developer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("admin")}
                disabled={loading}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  formData.role === "admin"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 gap-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Signing in</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-medium">Note:</span> Your account must be
            approved by an admin before you can log in.{" "}
            <a
              href="https://wa.me/628888118514?text=Hello%20Admin,%20I%20have%20just%20registered%20my%20account%20and%20would%20like%20to%20request%20an%20approval."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-blue-900 transition-colors"
            >
              Contact Admin Via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
