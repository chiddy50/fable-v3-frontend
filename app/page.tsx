import HomeComponent from "@/components/HomeComponent";
import dynamic from 'next/dynamic'
 
const DynamicComponentWithNoSSR = dynamic(
  () => import('@/components/HomeComponent'),
  { ssr: false }
)
export default async function Home() {

  

  return (
    <HomeComponent />
  );
}
