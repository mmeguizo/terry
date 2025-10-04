export default function Loading() {
  return (
    <div className="container py-12">
      <div className="relative w-full aspect-video max-h-[600px] overflow-hidden mb-6 rounded-md bg-neutral-800" />
      <div className="space-y-4">
        <div className="h-8 w-2/3 bg-neutral-800" />
        <div className="h-4 w-1/3 bg-neutral-800" />
        <div className="h-4 w-full bg-neutral-800" />
        <div className="h-4 w-[90%] bg-neutral-800" />
        <div className="h-4 w-[85%] bg-neutral-800" />
      </div>
    </div>
  );
}


