export function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-2xl"></div>
    </div>
  );
}