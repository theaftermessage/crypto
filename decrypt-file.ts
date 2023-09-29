const decryptFile = async (inputFileData: Buffer, key: ArrayBuffer): Promise<ArrayBuffer> => {
  try {
    // Decrypt file

    // IV length in bytes (you need to know the IV length)
    const ivLength = 12; // Set the IV length in bytes

    // Create a new Buffer for the IV
    const ivBuffer = Buffer.alloc(ivLength);

    // Create a new Buffer for the data
    const dataBuffer = Buffer.alloc(inputFileData.length - ivLength);

    // Copy the IV from the inputFileData
    inputFileData.copy(ivBuffer, 0, 0, ivLength);
    // Copy the data from the inputFileData
    inputFileData.copy(dataBuffer, 0, ivLength);

    // Decrypt the data using AES-GCM
    const decryptedFileData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer,
      },
      await window.crypto.subtle.importKey(
        'raw',
        key,
        'AES-GCM',
        true,
        ['encrypt', 'decrypt']
      ),
      dataBuffer
    );
    
    // Return decrypted file data
    return decryptedFileData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error; // Rethrow the error for higher-level handling
  }
};

// Function to convert a hex string to an ArrayBuffer
export function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
  try {
    const cleanHexString = hexString.replace(/\s/g, ''); // Remove any spaces
    const byteLength = cleanHexString.length / 2;
    const arrayBuffer = new ArrayBuffer(byteLength);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteLength; i++) {
      const byteValue = parseInt(cleanHexString.substr(i * 2, 2), 16);
      uint8Array[i] = byteValue;
    }

    return arrayBuffer;
  } catch (error) {
    console.error("Hex string to ArrayBuffer conversion error:", error);
    throw error; // Rethrow the error for higher-level handling
  }
}

export default decryptFile;
