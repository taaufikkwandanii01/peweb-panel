import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { FaEnvelope, FaCheck, FaKey } from 'react-icons/fa';

interface CardResetPasswordProps {
  onSubmit: (email: string) => Promise<void>;
  onCancel?: () => void;
}

const CardResetPassword: React.FC<CardResetPasswordProps> = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FaCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
          <p className="text-sm text-gray-500 mb-6">
            We&apos;ve sent password reset instructions to your email address.
          </p>
          <Button onClick={onCancel} variant="outline" fullWidth>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <FaKey className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-600">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
          fullWidth
          leftIcon={<FaEnvelope className="w-5 h-5" />}
        />

        <div className="space-y-3">
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Send Reset Link
          </Button>

          {onCancel && (
            <Button type="button" variant="outline" fullWidth onClick={onCancel}>
              Back to Login
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CardResetPassword;
