// 3D avatars for the fictional demo people: Microsoft Fluent Emoji 3D (MIT, see src/assets/avatars/LICENSE-fluentui-emoji.txt).
// Cartoon characters, not photos of real people; resized to 128 px WebP.
import aiko from "../assets/avatars/aiko.webp";
import alex from "../assets/avatars/alex.webp";
import daniel from "../assets/avatars/daniel.webp";
import lena from "../assets/avatars/lena.webp";
import maria from "../assets/avatars/maria.webp";
import omar from "../assets/avatars/omar.webp";
import { seed } from "./demo";

const BY_RECIPIENT: Record<string, string> = {
  "rcp-maria": maria,
  "rcp-daniel": daniel,
  "rcp-aiko": aiko,
  "rcp-lena": lena,
  "rcp-omar": omar,
};

export const DEMO_USER = { name: "Alex Morgan", avatar: alex };

export const recipientAvatar = (id: string) => BY_RECIPIENT[id];

/** Transfers to demo contacts are stored with the contact's name as merchant. */
export const avatarForName = (name: string) => {
  const r = seed.recipients.find((x) => x.name === name);
  return r ? BY_RECIPIENT[r.id] : undefined;
};
