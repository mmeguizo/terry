"use client";
import Image from "next/image";
import Link from "next/link";

function typeOfBlock(b) {
  return b?.__component || b?.component || b?.type || "";
}

export default function BlockRenderer({ blocks = [] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((b, i) => {
        const t = typeOfBlock(b);

        // Hero-like
        if (t.includes("hero")) {
          return (
            <section key={b.id ?? i} className="relative py-10">
              {b.background && (
                <Image
                  src={b.background?.url || b.background}
                  alt=""
                  className="w-full h-[320px] object-cover"
                />
              )}
              <div className="container mx-auto">
                <h2 className="text-3xl font-bold">{b.title || b.eventName}</h2>
                {Array.isArray(b.buttons) && b.buttons.length > 0 && (
                  <div className="mt-4 flex gap-3">
                    {b.buttons.map((btn, bi) => (
                      <Link
                        key={btn.id ?? bi}
                        href={btn.url || "#"}
                        className="px-4 py-2 bg-black text-white rounded"
                      >
                        {btn.label || "Learn more"}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        }

        // Rich text
        if (t.includes("rich") || t.includes("text")) {
          const html = b.html || b.body || b.content || "";
          return (
            <section
              key={b.id ?? i}
              className="prose prose-invert max-w-none container mx-auto py-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // CTA row (buttons array)
        if (t.includes("cta") && Array.isArray(b.buttons)) {
          return (
            <section key={b.id ?? i} className="container mx-auto py-8">
              <div className="flex flex-wrap gap-3">
                {b.buttons.map((btn, bi) => (
                  <Link
                    key={btn.id ?? bi}
                    href={btn.url || "#"}
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    {btn.label || "Learn more"}
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        // Fallback: show the raw block for debugging CMS mapping
        return (
          <pre
            key={b.id ?? i}
            className="container mx-auto my-6 overflow-auto rounded bg-neutral-900/80 text-white p-4 text-xs"
          >
            {JSON.stringify(b, null, 2)}
          </pre>
        );
      })}
    </>
  );
}