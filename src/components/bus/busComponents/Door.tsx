export default function Door({height = 80}: { height?: number }) {
  return (
    <div
      style={{height}}
      className="border-accent hover:bg-secondary w-full rounded-md border flex items-center justify-center text-center"
      >
      Door
    </div>
  );
}