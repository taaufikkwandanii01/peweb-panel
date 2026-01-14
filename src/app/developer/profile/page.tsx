import DeveloperProfile from '@/components/views/Developer/Profile/Index';
import MainLayouts from '@/components/layouts/MainLayouts';

export default function DeveloperProfilePage() {
  return (
    <MainLayouts userRole="developer">
      <DeveloperProfile />
    </MainLayouts>
  );
}
