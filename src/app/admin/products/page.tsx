import MainLayouts from "@/components/layouts/MainLayouts";
import AdminProducts from "@/components/views/Admin/Products";

export default function AdminProductsPage() {
  return (
    <MainLayouts userRole="admin">
      <AdminProducts />
    </MainLayouts>
  );
}
