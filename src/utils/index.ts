import crypto from "crypto";

export const createFileHash = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  return crypto
    .createHash("sha256")
    .update(Buffer.from(arrayBuffer))
    .digest("hex");
};
