import MainLayouts from "@/components/layouts/MainLayouts";
import ProductDetail from "@/components/views/Developer/Products/ProductDetail";

export default function ProductDetailPage() {
  return (
    <MainLayouts userRole="developer">
      <ProductDetail />
    </MainLayouts>
  );
}
