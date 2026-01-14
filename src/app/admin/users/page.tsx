import MainLayouts from '@/components/layouts/MainLayouts';
import AdminUsers from '@/components/views/Admin/Users/Index';

export default function AdminUsersPage() {
  return (
    <MainLayouts userRole="admin">
      <AdminUsers />
    </MainLayouts>
  );
}
