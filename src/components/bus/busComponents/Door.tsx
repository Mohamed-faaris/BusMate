import { useSeat } from "@/contexts/BusPropsContext";

export default function Door({ height = 80 }: { height?: number }) {
  const { scale } = useSeat();
  return (
    <div
      style={{ height: height * scale }}
      className="border-accent hover:bg-secondary flex w-full items-center justify-center rounded-md border text-center"
    >
      Door
    </div>
  );
}
