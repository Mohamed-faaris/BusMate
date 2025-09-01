import { Icon } from "lucide-react";
import { steeringWheel } from "@lucide/lab";
import { useSeat } from "@/contexts/BusPropsContext";

export default function Driver({ height = 45 }: { height?: number }) {
  const { scale } = useSeat();
  return (
    <div
      style={{ height: height * scale }}
      className="border-accent hover:bg-secondary flex items-center justify-center rounded-md border py-5"
    >
      <Icon iconNode={steeringWheel} />
    </div>
  );
}
