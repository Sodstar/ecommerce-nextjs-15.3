import Link from "next/link";

export default function Footer({ simplified = false }: { simplified?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      {!simplified ? (
        // Full footer for regular pages
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Link href="/home2" className="flex items-center gap-2 group mb-4">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight">
                  MODRN<span className="text-amber-500">.</span>
                </h2>
              </Link>
              <p className="text-zinc-600 mb-6 max-w-md">
                Curated home decor and furniture collections that blend modern
                aesthetics with timeless craftsmanship.
              </p>
              <div className="flex gap-4">
                {["facebook", "instagram", "pinterest", "twitter"].map(
                  (social) => (
                    <Link
                      href={`#${social}`}
                      key={social}
                      className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200"
                    >
                      <span className="sr-only">{social}</span>
                      <i className={`icon-${social}`}></i>
                    </Link>
                  )
                )}
              </div>
            </div>

            {["Shop", "Company", "Support"].map((category) => (
              <div key={category}>
                <h3 className="font-medium mb-4">{category}</h3>
                <ul className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-zinc-600 hover:text-black transition-colors"
                      >
                        {
                          [
                            "New Arrivals",
                            "Best Sellers",
                            "Sale",
                            "Collections",
                            "About Us",
                            "Contact",
                            "FAQ",
                            "Shipping",
                          ][i + (category === "Company" ? 4 : 0)]
                        }
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm mb-4 md:mb-0">
              © {currentYear} MODRN. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Cookies Settings
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Simplified footer for auth pages
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-zinc-500">
              <Link href="#" className="hover:text-zinc-900">Privacy Policy</Link>
              <span>•</span>
              <Link href="#" className="hover:text-zinc-900">Terms of Service</Link>
              <span>•</span>
              <Link href="#" className="hover:text-zinc-900">Help</Link>
            </div>
            <p className="mt-4 text-xs text-zinc-400">
              © {currentYear} MODRN. All rights reserved.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
