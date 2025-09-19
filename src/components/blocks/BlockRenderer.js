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
            <section key={b.id ?? i} className="relative py-10 xl:py-16 2xl:py-20">
              {b.background && (
                <Image
                  src={b.background?.url || b.background}
                  alt=""
                  className="w-full h-[320px] xl:h-[400px] 2xl:h-[480px] object-cover"
                />
              )}
              <div className="container mx-auto">
                <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold">{b.title || b.eventName}</h2>
                {Array.isArray(b.buttons) && b.buttons.length > 0 && (
                  <div className="mt-4 xl:mt-6 2xl:mt-8 flex gap-3 xl:gap-4 2xl:gap-5">
                    {b.buttons.map((btn, bi) => (
                      <Link
                        key={btn.id ?? bi}
                        href={btn.url || "#"}
                        className="px-4 py-2 xl:px-6 xl:py-3 2xl:px-8 2xl:py-4 bg-black text-white rounded text-sm xl:text-base 2xl:text-lg"
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
              className="prose prose-invert max-w-none container mx-auto py-8 xl:py-12 2xl:py-16 prose-lg xl:prose-xl 2xl:prose-2xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // CTA row (buttons array)
        if (t.includes("cta") && Array.isArray(b.buttons)) {
          return (
            <section key={b.id ?? i} className="container mx-auto py-8 xl:py-12 2xl:py-16">
              <div className="flex flex-wrap gap-3 xl:gap-4 2xl:gap-5">
                {b.buttons.map((btn, bi) => (
                  <Link
                    key={btn.id ?? bi}
                    href={btn.url || "#"}
                    className="px-4 py-2 xl:px-6 xl:py-3 2xl:px-8 2xl:py-4 bg-black text-white rounded text-sm xl:text-base 2xl:text-lg"
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
            className="container mx-auto my-6 xl:my-8 2xl:my-10 overflow-auto rounded bg-neutral-900/80 text-white p-4 xl:p-6 2xl:p-8 text-xs xl:text-sm 2xl:text-base"
          >
            {JSON.stringify(b, null, 2)}
          </pre>
        );
      })}
    </>
  );
}