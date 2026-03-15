import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative w-full overflow-hidden">
      <BackgroundAnimation />
      <Navbar />
      <div className="flex-1 w-full">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
