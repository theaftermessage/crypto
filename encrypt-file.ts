import * as CryptoJS from 'crypto-js';

export default function encryptFile(inputFileJson: string, key: string) {
  // parse json string
  const inputFile = JSON.parse(inputFileJson || "");

  const fileData: string = inputFile!.data || "";

  const fileExtension: string = inputFile!.metadata || "";

  const encryptionKey = CryptoJS.enc.Hex!.parse(key);
  const iv = CryptoJS.lib.WordArray!.random(16);

  const encryptedFileData = CryptoJS.AES.encrypt(fileData!.toString(), encryptionKey, { iv: iv });
  const encryptedMetadata = CryptoJS.AES.encrypt(fileExtension, encryptionKey, { iv: iv });

  const data = {
    iv: iv!.toString(),
    data: encryptedFileData!.toString(),
    metadata: encryptedMetadata!.toString()
  };

  // return data as json string
  return JSON.stringify(data);
}