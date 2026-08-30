import { Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

// One place to list product photos — add/remove entries here, the grid updates automatically.
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

export default function HomePage() {
  return (
    <main className="flex flex-col items-center px-6 py-12 gap-16">
      {/* Page heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold"> Welcome To</h1>
        <h2 className="text-3xl font-bold">Step Group Portal</h2>
        <p className="mt-2 text-gray-400">
          Live production numbers for Step Group operations
        </p>
      </div>

      {/* Two main navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        <Link href="/tote-bag">
          <Card className="hover:shadow-lg bg-[#25C2AE] transition-shadow cursor-pointer">
            <Card.Header>
              <Card.Title className="text-black text-lg">Tote Bag</Card.Title>
              <Card.Description className="text-white">
                Production data, fabric needs
              </Card.Description>
            </Card.Header>
          </Card>
        </Link>

        <Link href="/retail">
          <Card className="hover:shadow-lg  bg-[#B00424] transition-shadow cursor-pointer">
            <Card.Header>
              <Card.Title className="text-black text-lg">Footwear Retail</Card.Title>
              <Card.Description className="text-white">Retail sales dashboard</Card.Description>
            </Card.Header>
          </Card>
        </Link>
      </div>

      {/* Static product photo grid */}
      <div className="w-full max-w-4xl">
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

      {/* Footer */}
      <footer className="mt-8 text-sm text-gray-400 text-center">
        Step Group of Industries — Step Promo
      </footer>
    </main>
  );
}