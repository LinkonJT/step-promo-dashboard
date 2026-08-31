// app/components/ProductPhotoGrid.tsx
import Image from "next/image";

const products = [
  { file: "TBUSB50.png", label: "TBUSB50" },
  { file: "TBUSB800.png", label: "TBUSB800" },
  { file: "TBUSB800G.png", label: "TBUSB800G" },
  { file: "TBUSB516G.png", label: "TBUSB516G" },
  { file: "TBUSB124.png", label: "TBUSB124" },
  { file: "TBUSB25.png", label: "TBUSB25" },
  { file: "APRSB17.png", label: "APRSB17" },
  { file: "APRK501.png", label: "APRK501" },
  { file: "APR701.png", label: "APR701" },
];

export function ProductPhotoGrid() {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.file} className="text-center">
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={`/products/${product.file}`}
                alt={product.label}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-contain p-2"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">{product.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}