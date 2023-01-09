import { customAlphabet } from "nanoid/non-secure";

export const seedLength = 12;

const nanoid = customAlphabet("1234567890", seedLength);

export function getSeed() {
  return Number(nanoid().padEnd(seedLength, "0"));
}
