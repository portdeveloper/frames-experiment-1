import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { join, normalize } from "path";
import * as fs from "fs";
import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
  Address,
} from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

const interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
let interBold = fs.readFileSync(interBoldPath);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const addyOrEns = searchParams.get("addyOrEns") ?? "";

  let addy;
  if (!isAddress(addyOrEns)) {
    addy = await publicClient.getEnsAddress({
      name: normalize(addyOrEns),
    });
  }

  const balance = await publicClient.getBalance({
    address: addy as Address,
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex", // Use flex layout
          flexDirection: "row", // Align items horizontally
          alignItems: "stretch", // Stretch items to fill the container height
          width: "100%",
          height: "100vh", // Full viewport height
          backgroundColor: "#f4f8ff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingLeft: 24,
            paddingRight: 24,
            lineHeight: 1.2,
            fontSize: 36,
            color: "black",
            flex: 1,
            overflow: "hidden",
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 12,
              display: "flex",
            }}
          >
            <strong>👀 testing 🪟</strong>
          </div>
          <div
            style={{
              color: "#0a588c",
              fontSize: 48,
              marginBottom: 12,
              display: "flex",
            }}
          >
            <strong>{addyOrEns}</strong>
          </div>
          <div
            style={{
              display: "flex",
              overflow: "hidden",
            }}
          >
            {`Address: ${addy}`}
          </div>
          <div
            style={{
              display: "flex",
              overflow: "hidden",
            }}
          >
            {`Balance: ${formatEther(balance)} ETH`}
          </div>
        </div>
      </div>
    ),
    {
      width: 1528,
      height: 800,
      fonts: [
        {
          name: "Inter",
          data: interReg,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );
}
