import express, { type Request, type Response } from "express";
import crypto from "crypto";
import axios from "axios";
const app = express();
app.use(express.json()); // for parsing application/json

// Decryption function
function decryptString(encryptedData: string): string {
  const key = "mysecretprivatek"; // Hardcoded private key (must match the client-side key)
  const bufferKey = Buffer.from(key.padEnd(32, "\0"), "utf-8");

  // Decode the base64 encrypted data
  const encryptedBytes = Buffer.from(encryptedData, "base64");

  // Extract IV and encrypted text
  const iv = encryptedBytes.slice(0, 16);
  const encryptedText = encryptedBytes.slice(16);

  // Create decipher
  const decipher = crypto.createDecipheriv("aes-256-cbc", bufferKey, iv);
  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Handle POST requests at /handle route
app.post("/handle", async (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const decryptedData = decryptString(data);
    console.log(`Decrypted data: ${decryptedData}`);
    const parsedData = JSON.parse(decryptedData);
    const resp = await axios(parsedData)
    console.log(`Fetched data from ${parsedData.url}:`, resp.data);

    res.json({
      success: true,
      data: resp.data,
    });
    console.log("lllllllllllllllllllllllllll")
  } catch (error) {
    res
      .status(500)
      .json({ error: "Decryption failed", details: (error as Error).message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
