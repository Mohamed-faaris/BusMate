import Title from "@/components/Title";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Title />
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
