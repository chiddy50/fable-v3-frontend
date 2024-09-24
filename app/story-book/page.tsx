import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png"
import StoryWriter from "@/components/StoryWriter";
import CreateStoryBookComponent from "@/components/StoryBook/CreateStoryBookComponent";

export default function StoryBook() {
  return (
    <main className="flex-1 flex flex-col">
      
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-blue-500 flex flex-col space-y-5 
        justify-center items-center order-1 lg:-order-1 pb-10 pt-10">
          <Image src={logo} height={250} alt="Logo"/>
          <Button asChild className="px-20 bg-blue-700 p-10 text-xl">
            <Link href="/stories">Explore Story Library</Link>
          </Button>
        </div>

        {/* StoryWriter */}
        <CreateStoryBookComponent />
        
      </section>
      
    </main>
  );
}
