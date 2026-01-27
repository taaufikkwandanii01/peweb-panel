"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FaSpinner } from "react-icons/fa";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "developer" | "admin";
}

export default function RegisterView() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "developer",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = (): string | null => {
    // Validasi password match
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    // Validasi panjang password
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    // Validasi nomor telepon (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      return "Please enter a valid phone number";
    }

    // Validasi panjang nomor telepon
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return "Phone number must be between 10-15 digits";
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with:", {
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      });

      const result = await authService.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
      });

      console.log("Registration result:", result);

      if (result.success) {
        setSuccess(true);
        // Redirect ke login setelah 3 detik
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setError(result.message || "Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      const error = err as Error;
      setError(
        error.message || "An unexpected error occurred during registration",
      );
      console.error("Registration error:", error);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your account has been created successfully.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Important:</span> Your account
                status is <strong>pending</strong>. Please wait for admin
                approval before you can log in.
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to login page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Sign up as a developer</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="Uilliam Bandros"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="your@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="081933565666"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  <span>Creating Account</span>
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-medium">Note:</span> After registration, your
            account will need to be approved by an admin before you can log in.
          </p>
        </div>
      </div>
    </div>
  );
}
