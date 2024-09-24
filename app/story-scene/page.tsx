import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/images/logo.png"
import CreateStorySceneComponent from "@/components/StoryScene/CreateStorySceneComponent";

export default function StoryScenePage() {
  return (
    <main className="flex-1 flex flex-col">
        <div className="flex justify-center mb-4">
            <h2 className="text-xl uppercase tracking-widest">Create a Story with Scenes</h2>
        </div>
      <section className="flex justify-center">
        <CreateStorySceneComponent />
        
      </section>
      
    </main>
  );
}
