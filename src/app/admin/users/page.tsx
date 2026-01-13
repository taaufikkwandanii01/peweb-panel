import MainLayouts from '@/components/layouts/MainLayouts';
import AdminUsers from '@/components/views/Admin/Users/Index';

export default function AdminUsersPage() {
  return (
    <MainLayouts userRole="admin" userName="John Doe">
      <AdminUsers />
    </MainLayouts>
  );
}
