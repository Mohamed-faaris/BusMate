import { BusPropsProvider } from "@/contexts/BusPropsContext";
import BookingPage from "./BookingPage";

export default function Page() {
  return (
    <BusPropsProvider>
      <BookingPage />
    </BusPropsProvider>
  );
}
