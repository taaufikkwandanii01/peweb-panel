'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useRequireAuth(allowedRoles?: ('admin' | 'developer')[]) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (allowedRoles) {
        const userRole = user.user_metadata?.role;
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          // Redirect to appropriate dashboard
          if (userRole === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/developer/dashboard');
          }
        }
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading, isAuthorized };
}
