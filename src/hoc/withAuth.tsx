'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: ('admin' | 'developer')[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/auth/login');
        } else if (allowedRoles) {
          const userRole = user.user_metadata?.role;
          if (!allowedRoles.includes(userRole)) {
            // Redirect to appropriate dashboard based on role
            if (userRole === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/developer/dashboard');
            }
          }
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    if (allowedRoles) {
      const userRole = user.user_metadata?.role;
      if (!allowedRoles.includes(userRole)) {
        return null;
      }
    }

    return <Component {...props} />;
  };
}
