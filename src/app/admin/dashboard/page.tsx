import MainLayouts from '@/components/layouts/MainLayouts';
import AdminDashboard from '@/components/views/Admin/Dashboard/Index';

export default function AdminDashboardPage() {
  return (
    <MainLayouts userRole="admin" userName="John Doe">
      <AdminDashboard />
    </MainLayouts>
  );
}
