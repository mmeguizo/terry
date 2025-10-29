export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative h-64 md:h-80 lg:h-96 bg-neutral-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
        <div className="container relative h-full flex flex-col justify-end pb-8 md:pb-12">
          <div className="max-w-4xl space-y-4">
            <div className="h-12 bg-white/10 rounded w-3/4"></div>
            <div className="h-6 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="container py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-2/3 mb-4"></div>
              <div className="h-32 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

