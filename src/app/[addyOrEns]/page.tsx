import { Metadata } from "next";
import Echo from "@/app/components/Echo";

const postUrl = `${process.env["HOST"]}/api/echo`;

export async function generateMetadata({
  params: { addyOrEns },
}: {
  params: { addyOrEns: string };
}): Promise<Metadata> {
  const imageUrl = `${process.env["HOST"]}/api/images/start?addyOrEns=${addyOrEns}`;

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
      "fc:frame:input:text": "Type address or ENS...",
      "fc:frame:button:1": "Search!",
      "fc:frame:button:2": "See on 👀 address.vision",
      "fc:frame:button:2:action": "link",
      "fc:frame:button:2:target": `https://address.vision/${addyOrEns}`,
    },
  };
}

export default function Home() {
  return <Echo />;
}
