import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="container mx-auto max-w-4xl space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Print Smart. <span className="text-primary">Save Time.</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            Skip the long queues. Upload your documents, pay online, and pick up your prints instantly at college.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard/new-order">
              <Button size="lg" className="px-8 shadow-lg shadow-primary/20">Order Now</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">Check Prices</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl">
              🚀
            </div>
            <h3 className="text-xl font-bold">Fast & Easy</h3>
            <p className="opacity-70">Upload from anywhere, anytime. No more waiting in lines.</p>
          </div>
          <div className="card text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl">
              💰
            </div>
            <h3 className="text-xl font-bold">Student Friendly</h3>
            <p className="opacity-70">Affordable rates designed for students. Save up to 40%.</p>
          </div>
          <div className="card text-center space-y-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-2xl">
              🔒
            </div>
            <h3 className="text-xl font-bold">Secure Payment</h3>
            <p className="opacity-70">Pay 50% advance securely via UPI/QR code to confirm orders.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
