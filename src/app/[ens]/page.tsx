import { Metadata } from "next";
import Echo from "@/app/components/Echo";

const postUrl = `https://twelve-bugs-lick.loca.lt/api/echo`;

export async function generateMetadata({
  params: { ens },
}: {
  params: { ens: string };
}): Promise<Metadata> {
  console.log("ens is here ->>>>>", ens);
  const imageUrl = `https://twelve-bugs-lick.loca.lt/api/images/start?ens=${ens}`;

  return {
    title: "Echo the ENS DOLPHIN",
    description: "Type something and Echo ENS ENS ENS ENS!",
    openGraph: {
      title: "Echo the ENS DOLPHIN",
      images: [imageUrl],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:post_url": postUrl,
      "fc:frame:input:text": "Type something ENS...",
      "fc:frame:button:1": "🐬 ENS",
    },
  };
}

export default function Home() {
  return <Echo />;
}
