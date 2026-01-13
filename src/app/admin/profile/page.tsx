import MainLayouts from '@/components/layouts/MainLayouts';
import AdminProfile from '@/components/views/Admin/Profile/Index';

export default function AdminProfilePage() {
  return (
    <MainLayouts userRole="admin" userName="John Doe">
      <AdminProfile />
    </MainLayouts>
  );
}
