import { SeatSelectorProvider } from "@/contexts/SeatContext";
import BookingPage from "./BookingPage";

export default function Page() {
  return (
    <SeatSelectorProvider>
      <BookingPage />
    </SeatSelectorProvider>
  );
}
