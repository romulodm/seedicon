/**
 * `@download/blockies` ships no types. The compatibility test only needs
 * `renderIcon`, and only in enough detail to hand it a stand-in canvas.
 */
declare module "@download/blockies/src/blockies.mjs" {
  export function renderIcon(
    options: { seed: string; size?: number; scale?: number },
    canvas: {
      width: number;
      height: number;
      getContext: (id: string) => unknown;
    },
  ): unknown;
}
