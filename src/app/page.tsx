import Image from "next/image";

export default function Home() {
  return (
    <main className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen  items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to  
              <span className="text-transparent">
                <span className="text-[#061D4E]"> Work</span>
                <span className="text-[#F35C27]">Bond</span>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connecting talented professionals with forward-thinking companies.
              WorkBond bridges the gap between exceptional talent and meaningful
              opportunities, creating lasting professional relationships that
              drive success.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
