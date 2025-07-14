import { Icon } from "lucide-react";
import { steeringWheel } from "@lucide/lab";
// Removed cn import since inline style is used for dynamic height

export default function Driver({ height = 45 }: { height?: number }) {
  return (
    <div
      style={{ height }}
      className="border-accent hover:bg-secondary flex items-center justify-center rounded-md border py-5"
    >
      <Icon iconNode={steeringWheel} />
    </div>
  );
}
