import { Icon } from "lucide-react";
import { steeringWheel } from "@lucide/lab";

export default function Driver() {
  return (
    <div className="border-accent hover:bg-secondary flex py-5 justify-center rounded-md border">
      <Icon iconNode={steeringWheel} />
    </div>
  );
}
