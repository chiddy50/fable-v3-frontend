import HomeComponent from "@/components/HomeComponent";


async function getStories(){
  let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/all`;
  const res = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  });

  const json = await res.json();
  console.log(json);
  let data = json?.stories;
  return data
}

export default async function Home() {
  const stories = await getStories();

  return (
    <>
    {
      stories &&
    <HomeComponent stories={stories}/>
    }
    </>
  );
}
