import { NextRequest, NextResponse } from "next/server";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";

const HUB_URL = process.env["HUB_URL"] || "nemes.farcaster.xyz:2283";
const hubClient = getSSLHubRpcClient(HUB_URL);

const postUrl = `${process.env["HOST"]}/api/echo`;

export async function POST(req: NextRequest) {
  const {
    untrustedData: { inputText },
    trustedData: { messageBytes },
  } = await req.json();
  const frameMessage = Message.decode(Buffer.from(messageBytes, "hex"));
  const validateResult = await hubClient.validateMessage(frameMessage);
  if (validateResult.isOk() && validateResult.value.valid) {
    const validMessage = validateResult.value.message;

    let urlBuffer = validMessage?.data?.frameActionBody?.url ?? [];
    const urlString = Buffer.from(urlBuffer).toString("utf-8");
    if (!urlString.startsWith(`${process.env["HOST"]}` ?? "")) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const message = inputText ?? "";
    const imageUrl = `${process.env["HOST"]}/api/images/start?addyOrEns=${message}`;
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Echo Says:</title>
          <meta property="og:title" content="Echo Says:" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:input:text" content="Type an address or ENS..." />
          <meta name="fc:frame:button:1" content="Search" />
          <meta property="fc:frame:button:2" content="See on 👀 address.vision" />
          <meta property="fc:frame:button:2:action" content="link" />
          <meta property="fc:frame:button:2:target" content="https://address.vision/${message}" />
        </head>
        <body/>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } else {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

export const GET = POST;
