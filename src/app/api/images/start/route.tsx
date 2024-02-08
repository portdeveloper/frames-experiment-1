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

  if (!addyOrEns) {
    return new ImageResponse(<div>test</div>);
  }

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
            lineHeight: 1.2,
            fontSize: 36,
            color: "black",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 12,
              display: "flex",
              backgroundColor: "#fff",
              padding: 24,
            }}
          >
            <strong>
              <span
                style={{
                  marginRight: 12,
                  fontSize: 54,
                }}
              >
                👀
              </span>{" "}
              address.vision{" "}
            </strong>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 48,
                fontSize: 36,
                padding: 12,
                paddingRight: 48,
                paddingLeft: 48,
                borderRadius: 999,
                border: "1px solid #0a588c",
                backgroundColor: "#f4f8ff",
              }}
            >
              <div>{addy}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: 24,
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "36px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "500px",
                lineHeight: "1.4",
              }}
            >
              {/* Replace 'profilePic' with the path to the profile picture */}
              {/* <img
              // src={profilePic}
              alt="profile"
              style={{ width: "64px", height: "64px", borderRadius: "50%" }}
            /> */}
              <span
                style={{
                  marginTop: "12px",
                  fontSize: "36px",
                  fontWeight: "700",
                }}
              >
                {addyOrEns}
              </span>
              <span
                style={{
                  marginTop: "4px",
                  fontSize: "30px",
                  fontWeight: "400",
                }}
              >
                Balance: {Number(formatEther(balance)).toFixed(4)} ETH
              </span>
            </div>
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
