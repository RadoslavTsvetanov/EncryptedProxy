async function encrypt_string(plain_text: string): Promise<string> {
  const key = "mysecretprivatek"; // Hardcoded private key (must be 32 bytes)
  const keyBytes = new TextEncoder().encode(key.padEnd(32, "\0"));

  const iv = crypto.getRandomValues(new Uint8Array(16));
  const cipher = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    cipher,
    new TextEncoder().encode(plain_text)
  );

  // Concatenate IV and encrypted data, then encode to base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

interface RequestObject {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}

async function sendEncryptedRequest(
  requestObject: any
): Promise<any> {
  const requestString = JSON.stringify(requestObject);
  const encryptedRequest = await encrypt_string(requestString);
  const response = await fetch("http://localhost:3000/handle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: encryptedRequest }),
  });
  return await response.json();
}

const requestObject = {
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/todos/1",
  headers: {
    Authorization: "Bearer token",
    "Content-Type": "application/json",
  },
  data: JSON.stringify({ key: "value" }),
};

sendEncryptedRequest(requestObject)
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
