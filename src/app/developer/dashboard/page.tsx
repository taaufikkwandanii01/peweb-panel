import MainLayouts from '@/components/layouts/MainLayouts';
import DeveloperDashboard from '@/components/views/Developer/Dashboard/Index';

export default function DeveloperDashboardPage() {
  return (
    <MainLayouts userRole="developer" userName="Jane Developer">
      <DeveloperDashboard />
    </MainLayouts>
  );
}
