import AdminProfile from '@/components/views/Admin/Profile/Index';
import MainLayouts from '@/components/layouts/MainLayouts';

export default function AdminProfilePage() {
  return (
    <MainLayouts userRole="admin">
      <AdminProfile />
    </MainLayouts>
  );
}
