export const encryptFile = async (inputFileData: Buffer, key: ArrayBuffer): Promise<ArrayBuffer> => {
  // Encrypt file
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encryptedFileData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    await window.crypto.subtle.importKey(
      'raw',
      key,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    ),
    inputFileData
  )
  // Convert IV Buffer to ArrayBuffer
  const ivArrayBuffer = iv.buffer;

  // Create a new Uint8Array to hold the combined data
  const combinedData = new Uint8Array(ivArrayBuffer.byteLength + encryptedFileData.byteLength);

  // Set IV data
  combinedData.set(new Uint8Array(ivArrayBuffer), 0);

  // Set data following IV
  combinedData.set(new Uint8Array(encryptedFileData), ivArrayBuffer.byteLength);

  // Create an ArrayBuffer from the combined Uint8Array
  const combinedArrayBuffer = combinedData.buffer;

  return combinedArrayBuffer;
}

export const generateKey = async (): Promise<ArrayBuffer> => {
  // Generate a random key
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  )

  // Export key
  const exportedKey = await window.crypto.subtle.exportKey('raw', key)

  // Return key
  return exportedKey
}