export default function Loading() {
  return (
    <div className="event-surface py-16">
      <div className="container">
        <div className="h-10 w-1/2 bg-neutral-800 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-800" />
            <div className="h-4 w-[95%] bg-neutral-800" />
            <div className="h-4 w-[90%] bg-neutral-800" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-800" />
            <div className="h-4 w-[95%] bg-neutral-800" />
            <div className="h-4 w-[90%] bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}


