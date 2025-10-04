"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainNav({ items = [] }) {
  const pathname = usePathname();
  if (!Array.isArray(items) || items.length === 0) return null;

  const norm = (u) => (u || "/").replace(/\/+$/, "") || "/";
  const current = norm(pathname);

  return (
    <nav aria-label="Main">
      <ul className="flex gap-4 items-center">
        {items.map((it, i) => {
          const href = it?.url || "/";
          const isActive = norm(href) === current;
          return (
            <li key={it.id ?? i}>
              <Link
                href={href}
                className={`px-3 py-2 rounded ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`}
              >
                {it.label || "Untitled"}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}