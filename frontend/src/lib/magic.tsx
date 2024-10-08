import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

const createMagic = (key: string) => {
  return (
    typeof window !== "undefined" &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
    })
  );
};

export const magic = createMagic(import.meta.env.VITE_MAGIC_PUBLIC_KEY);
