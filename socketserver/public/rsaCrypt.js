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
    console.log("RSA Key Pair Generated");
  }
  
  //Encryption
  async function encryptMessage(message) {
    const encodedMessage = new TextEncoder().encode(message);
    const encryptedMessage = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
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
  
