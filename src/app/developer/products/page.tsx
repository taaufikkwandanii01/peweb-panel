import MainLayouts from "@/components/layouts/MainLayouts";
import DeveloperProducts from "@/components/views/Developer/Products";

export default function DeveloperProductsPage() {
  return (
    <MainLayouts userRole="developer">
      <DeveloperProducts />
    </MainLayouts>
  );
}
