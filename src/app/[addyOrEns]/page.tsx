import { Metadata } from "next";
import Echo from "@/app/components/Echo";

const postUrl = `https://046e9d296f87b135a75090b63a3de42d.serveo.net/api/echo`;

export async function generateMetadata({
  params: { addyOrEns },
}: {
  params: { addyOrEns: string };
}): Promise<Metadata> {
  const imageUrl = `https://046e9d296f87b135a75090b63a3de42d.serveo.net/api/images/start?addyOrEns=${addyOrEns}`;

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
      "fc:frame:button:2": "🐬 addyOrEns page btn",
    },
  };
}

export default function Home() {
  return <Echo />;
}
