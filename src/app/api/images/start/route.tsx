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
import { blo } from "blo";
import { CovalentClient } from "@covalenthq/client-sdk";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const client = new CovalentClient(process.env["COVALENT_API_KEY"] as string);

const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

const interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
let interBold = fs.readFileSync(interBoldPath);

const getTokens = async (addy: Address) => {
  const res = await client.BalanceService.getTokenBalancesForWalletAddress(
    "eth-mainnet",
    addy,
    {
      nft: false,
      noSpam: true,
    }
  );
  if (res.data && res.data.items) {
    const filteredTokens = res.data.items
      ? res.data.items.filter((token) => token.quote !== 0)
      : [];
    return filteredTokens;
  }
};

const getNfts = async (addy: Address) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": process.env["OPENSEA_API_KEY"] || "default-key",
    },
  };

  try {
    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${addy}/nfts`,
      options
    );
    const data = await response.json();

    if (data.nfts && data.nfts.length > 0) {
      const nftData = [];
      for (let i = 0; i < Math.min(4, data.nfts.length); i++) {
        const nft = data.nfts[i];
        if (nft.image_url && nft.identifier !== "0") {
          nftData.push({
            imageUrl: nft.image_url,
            contract: nft.contract,
            identifier: nft.identifier,
          });
        }
      }
      return nftData;
    }
  } catch (err) {
    console.error(err);
  }
};

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
  const isEns = addyOrEns.endsWith(".eth");
  const imageSrc = isEns
    ? `https://metadata.ens.domains/mainnet/avatar/${addyOrEns}`
    : blo(addyOrEns as Address);
  const tokens = await getTokens(addy as Address); // Fetch token balances
  const nfts = await getNfts(addy as Address);

  const filteredTokens = tokens
    ? tokens
        .slice(0, 10)
        .filter((t) => t.quote != null && t.quote.toFixed(0) !== "0")
    : [];

  const tokensInfo = filteredTokens.map((token) => ({
    name: token.contract_ticker_symbol,
    balance: formatTokenBalance(
      token.balance as bigint,
      token.contract_decimals
    ),
    quote: `$${Number(token.quote_rate).toFixed(2)}`, // Assuming quote_rate is available and represents the USD value
  }));

  console.log("tokensInfo", tokensInfo);

  const truncateBalance = (balance: string) => {
    const balanceStr = balance.toString();
    return balanceStr.length > 8
      ? `${balanceStr.substring(0, 8)}...`
      : balanceStr;
  };

  return new ImageResponse(
    (
      <div style={{ display: "flex" }} tw="w-full h-full">
        <div style={{ display: "flex" }} tw="flex-col flex-grow">
          <div
            style={{ display: "flex" }}
            tw="max-h-[125px] bg-white p-4 items-center flex-grow "
          >
            <strong tw="text-5xl">👀 address.vision</strong>
            <div tw="ml-12 text-4xl bg-blue-50 p-4 px-6 rounded-full border border-slate-300 ">
              {addy}
            </div>
          </div>
          <div tw="flex bg-blue-50 flex-grow justify-between pt-2">
            <div tw="flex flex-col">
              <div tw="flex">
                <div tw="bg-white text-4xl m-8 p-8 h-[222px] rounded-16 shadow-2xl flex items-center justify-between ">
                  <img
                    src={imageSrc}
                    width={150}
                    height={150}
                    tw="rounded-full"
                  />
                  <div tw="flex flex-col ml-8">
                    <strong>{addyOrEns}</strong>
                    <span tw="mt-2">
                      Balance: {Number(formatEther(balance)).toFixed(4)} ETH
                    </span>
                  </div>
                </div>
                <div tw="bg-white text-4xl m-8 ml-0 p-8 h-[222px] rounded-16 shadow-2xl flex items-center justify-between ">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=${addy}`}
                    width={190}
                    height={190}
                  />
                </div>
              </div>

              <div tw="bg-white text-4xl m-8 mt-0 p-12 h-[350px] rounded-16 shadow-2xl flex items-center justify-center">
                <div
                  style={{
                    gap: "16px",
                  }}
                  tw="flex"
                >
                  {nfts?.map((nft) => (
                    <img
                      key={nft.imageUrl}
                      src={nft.imageUrl}
                      width={190}
                      height={200}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div tw="bg-white text-4xl m-8 ml-0 h-[590px] w-[480px] overflow-hidden p-8 rounded-16 shadow-2xl flex flex-col ">
              <div tw="flex flex-col w-full">
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                    padding: "10px 0",
                    borderBottom: "2px solid #000",
                  }}
                >
                  <span style={{ flex: 1, fontSize: "18px" }}>Token</span>
                  <span style={{ flex: 1, fontSize: "18px" }}>Balance</span>
                  <span style={{ flex: 1, fontSize: "18px" }}>
                    Balance in USD
                  </span>
                </div>

                {/* Rows */}
                {tokensInfo.map((token, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-around",
                      padding: "10px 0",
                      borderBottom: "1px solid #ddd",
                      fontSize: "22px",
                    }}
                  >
                    <span style={{ flex: 1 }}>{token.name}</span>
                    <span style={{ flex: 1 }}>
                      {truncateBalance(token.balance)}
                    </span>
                    <span style={{ flex: 1 }}>≈{token.quote}</span>
                  </div>
                ))}
              </div>
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
// This is a helper function similar to formatTokenBalance for API route context
const formatTokenBalance = (balance: bigint, decimals: number) => {
  const divisor = BigInt(Math.pow(10, decimals));
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  return `${integerPart}.${fractionalPart.toString().padStart(decimals, "0").slice(0, 2)}`;
};
