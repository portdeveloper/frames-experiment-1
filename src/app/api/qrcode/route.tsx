// pages/api/qrcode/[addy].tsx

import type { NextApiRequest, NextApiResponse } from "next";
import QRCode from "qrcode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the Ethereum address from the URL query parameter
  const { addy } = req.query;

  console.log("addy", addy);

  // Ensure the Ethereum address is a string
  if (typeof addy !== "string") {
    return res.status(400).send("Invalid address");
  }

  // Generate the QR code
  try {
    const qrCodeImageBuffer = await QRCode.toBuffer(addy, {
      margin: 1,
    });

    // Set the content type and cache control headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=1800"); // Cache for 30 minutes

    // Send the QR code as a response
    res.status(200).end(qrCodeImageBuffer);
  } catch (error) {
    res.status(500).send("Error generating QR code");
  }
}
