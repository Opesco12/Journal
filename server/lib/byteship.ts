import { ByteshipClient } from "@byteship/js";

export const byteship = new ByteshipClient({
  apiKey: process.env.BYTESHIP_API_KEY!,
});
