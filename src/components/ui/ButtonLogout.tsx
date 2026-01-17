'use client';

import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button
      onClick={signOut}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Logout
    </Button>
  );
}
