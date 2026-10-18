import type { SeediconStyle } from "seedicon";

/**
 * Seeds for the home page gallery, picked by hand for each style.
 *
 * Every style reads the same seed in its own way, so a string that gives a
 * striking jdenticon can give a flat streamlines. Picking per style lets
 * each row show that style at its best. The docs page keeps one shared set
 * on purpose, so its rows stay comparable across styles.
 *
 * A style missing from GALLERY_SEEDS falls back to DEFAULT_SEEDS, so adding
 * a style to SEEDICON_STYLES never leaves a hole in the gallery. To choose
 * new ones, run `node site/scripts/seed-picker.mjs`, open the page it
 * writes, click the avatars you like and paste the generated block here.
 *
 * All seeds are fixed strings, so the gallery is identical on every build
 * and deploy.
 */

export const DEFAULT_SEEDS: readonly string[] = [
  "82987161-a8ab-421c-897b-08aec26cbdfc",
  "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
  "f0bed51b-2118-41bd-9961-ffb8b481c0be",
  "c369eab8-f551-4aa9-8c1c-ed22465e7573",
  "da1681bf-22d1-4ffb-af8b-94bcda00e208",
];

export const GALLERY_SEEDS: Partial<Record<SeediconStyle, readonly string[]>> = {
  pixels: [
    "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
    "teste231231@gmail.com",
    "82987161-a8ab-421c-897b-08aec26cbdfc",
    "69d40f05-fca4-43e6-be52-5ef5a193ac7c",
    "929e9dd7-84e2-4552-9e73-77db48cbb7d5",
  ],
  identicon: [
    "c369eab8-f551-4aa9-8c1c-ed22465e7573",
    "e0c1b10a-1e08-483f-8b48-30672f031e32",
    "2cd6e119-cbbc-4a18-8259-78278d98ad63",
    "a98ea671-0d7e-494c-8485-0e11574fc79c",
    "33a4d2e7-f202-4f3e-a274-ba0d6117624f",
  ],
  stellar: [
    "24120736-8d89-4d9f-9b7a-e6ba92e53ebc",
    "f91ef662-18a6-420b-92a8-f11d5c7dbbd6",
    "bcd1a374-a123-4bf7-8450-96ac0124c4a2",
    "a5192341-b249-4be0-a45a-f2430cf627e2",
    "b327f73b-8856-4701-ab1c-9fe9eddd263c",
  ],
  randomart: [
    "928e37d5-d82d-4adf-873e-db445b187196",
    "ff5bbf62-bbae-42a2-97b9-644530688681",
    "3cace521-d422-456e-a18d-e2ba6cabb0b9",
    "8816e5ae-63b6-4bff-b9f6-1b07980ec920",
    "05b6e73b-bfcd-495b-a01f-e08864677d6d",
  ],
  lifehash: [
    "c25c8ef4-ac1d-4bb5-969b-67b15d730db3",
    "ec7da957-89f4-4ff8-9f0f-a6f15b3e0a0e",
    "da1681bf-22d1-4ffb-af8b-94bcda00e208",
    "305ca2bf-0ab8-4aad-86fd-824f68b9157f",
    "d4311612-7724-41b3-a0f5-e092d9472991",
  ],
  dither: [
    "8d275a3a-aa57-48d3-81f3-f96fd5941a15",
    "cc294a28-205f-4bea-8ce3-03e52ec7f004",
    "1bb162a7-d990-4f2a-89e5-aab33431900e",
    "56151c7c-203e-4d81-9dbf-f6e51baddaed",
    "da2f2f93-fd9e-4d0a-a578-4935359d8327",
  ],
  pixelart: [
    "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
    "da1681bf-22d1-4ffb-af8b-94bcda00e208",
    "romulodm.dev",
    "f72da30c-93df-431e-a5a1-8a847ea77ce6",
    "1bd8afc4-93ff-44c3-b816-769240d1f0e7",
  ],
  truchet: [
    "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
    "c369eab8-f551-4aa9-8c1c-ed22465e7573",
    "da1681bf-22d1-4ffb-af8b-94bcda00e208",
    "e712c6ef-2081-4ad4-a741-4be1db7163c0",
    "8a0e9ff3-62a1-4715-9d8e-fe91596f20b9",
  ],
  heraldry: [
    "66d84a70-2b64-47c6-9531-80a45a4a0be2",
    "6d2de343-1625-424f-95ed-d7c8d1863a66",
    "eca17247-2b50-4a18-bf4d-6ddd8436314f",
    "e16107fc-b141-4109-b2ec-c4115441bd79",
    "585cb986-f18c-437b-941d-0aaacb43e1a1",
  ],
  streamlines: [
    "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
    "f0bed51b-2118-41bd-9961-ffb8b481c0be",
    "da1681bf-22d1-4ffb-af8b-94bcda00e208",
    "d8f20215-53a3-450d-b8ee-72a9effd1e36",
    "bc4a7bbf-ac42-42e9-af33-83b91e030024",
  ],
  moire: [
    "8fa47950-25f4-4ca2-b161-ecc2f3062246",
    "ff92c5b7-469d-4bde-b71d-d0f12b157323",
    "02e7fe42-9859-4adb-bdfd-45f67ed334cc",
    "697dc410-4974-4d96-9db6-2d0b7b9fc7ca",
    "01e94fab-4d1e-47f2-ac7a-5e7457cbfa24",
  ],
  terrain: [
    "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
    "c369eab8-f551-4aa9-8c1c-ed22465e7573",
    "da1681bf-22d1-4ffb-af8b-94bcda00e208",
    "da12d14d-5ef0-4694-8a3f-32f97d5bf919",
    "82987161-a8ab-421c-897b-08aec26cbdfc",
  ],
  marble: [
    "82987161-a8ab-421c-897b-08aec26cbdfc",
    "f0bed51b-2118-41bd-9961-ffb8b481c0be",
    "66a2604a-2ceb-485c-9df4-fa55b70c06fb",
    "012a2f38-e98d-42e6-8b8f-910430d1acf9",
    "004c7113-5f96-4ba6-899f-fa2cc873571f",
  ],
  waves: [
    "bd26a2ed-3587-4e55-ad70-226dfbb1d48d",
    "70c38d54-4fdd-438e-ba80-e0e5a659d3ec",
    "37cd0e8e-1685-4515-9c2e-7abcdae9e394",
    "a671dca5-20ac-4b33-b151-4e97c0ec81e1",
    "bf07677b-b131-472b-8a10-1eed7c0ff001",
  ],
  gradient: [
    "fb1bbdeb-c4a4-41e8-8a3c-368a55989d60",
    "c369eab8-f551-4aa9-8c1c-ed22465e7573",
    "1988f80a-5126-46b1-a5d7-745bfd40026f",
    "a6e7164e-f896-4f73-89ae-fc92a232f146",
    "1695908f-ca4e-499b-a5b0-656ae88eb2f1",
  ],
};

export function gallerySeedsFor(style: SeediconStyle): readonly string[] {
  return GALLERY_SEEDS[style] ?? DEFAULT_SEEDS;
}
