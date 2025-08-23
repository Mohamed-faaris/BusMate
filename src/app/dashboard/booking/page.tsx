import { SeatProvider } from "@/contexts/SeatContext";
import BookingPage from "./BookingPage";

export default function Page() {
  return (
    <SeatProvider>
      <BookingPage />
    </SeatProvider>
  );
}
