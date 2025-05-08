async function generateRSAKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey
    console.log("RSA Key Pair Generated");
  }
  
  //Encryption
  async function encryptMessage(message) {
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      UsedPublicKey,
      encodedMessage
    );
    return encryptedMessage;
  }
  
  // Decryption
  async function decryptMessage(encryptedMessage) {
    const decryptedMessage = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedMessage
    );
    return new TextDecoder().decode(decryptedMessage);
  }

  async function exportPublicKeyToBase64(publicKey) {
    const spki = await crypto.subtle.exportKey("spki", publicKey);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
    return b64;
  }
  
  async function importRsaPublicKey(base64Key) {
    // 1. Decode base64 to binary string
    const binaryDerString = atob(base64Key);
  
    // 2. Convert binary string to Uint8Array
    const binaryDer = new Uint8Array([...binaryDerString].map(char => char.charCodeAt(0)));
  
    // 3. Import the key using Web Crypto API
    return await crypto.subtle.importKey(
      "spki",                     // format for public RSA keys
      binaryDer.buffer,          // key data
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,                       // extractable
      ["encrypt"]                 // key usages
    );
  }

async function exchangeKeys(pKey) 
{
  const RSAkey = await exportPublicKeyToBase64(pKey); // Wait for key to be exported
  socket.emit('mouse',RSAkey) // send as base64 for transport)
}

async function initializeRSA() 
{
  await generateRSAKeyPair();
  await exchangeKeys(publicKey) 
}

async function emitData() 
{
  sentMessage = String(messageInput.value());
  
  // Convert message to binary string
  const binaryMessage = [...sentMessage]
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

  // Apply Hamming encoding
  const hammingEncoded = hammingCode.encode(binaryMessage);

  // Convert binary string to a string (optional: base64 or ASCII safe format)
  const byteArray = hammingEncoded.match(/.{1,8}/g).map(b => parseInt(b, 2));
  const encodedString = String.fromCharCode(...byteArray);

  const encrypted = await encryptMessage(messageInput.value());
  sentEncryptedMessages = (String(encrypted));  
  socket.emit('message', encrypted)
  console.log("Encrypted Message", encrypted);

}