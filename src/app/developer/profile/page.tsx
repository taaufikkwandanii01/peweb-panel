import MainLayouts from '@/components/layouts/MainLayouts';
import DeveloperProfile from '@/components/views/Developer/Profile/Index';

export default function DeveloperProfilePage() {
  return (
    <MainLayouts userRole="developer" userName="Jane Developer">
      <DeveloperProfile />
    </MainLayouts>
  );
}
