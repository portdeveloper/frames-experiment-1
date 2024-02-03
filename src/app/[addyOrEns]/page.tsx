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
      "fc:frame:input:text": "Type something ENS...",
      "fc:frame:button:1": "🐬 ENS",
    },
  };
}

export default function Home() {
  return <Echo />;
}
