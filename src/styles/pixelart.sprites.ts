/**
 * Sprite tables for the `pixelart` style.
 *
 * GENERATED FILE — do not hand-edit. The artwork is DiceBear's Pixel Art
 * style (https://www.dicebear.com/styles/pixel-art/), dedicated to the
 * public domain under CC0 1.0, exported from the Figma source at
 * https://www.figma.com/community/file/1198754108850888330 and copied here
 * verbatim apart from the colour interpolation, which was rewritten to take
 * seedicon's own palette object.
 *
 * Every path is authored on a 16x16 grid, which is why `pixelart.ts` wraps
 * the result in a `scale(size / 16)` group instead of rewriting coordinates.
 */

/** The colour slots a sprite can paint with. */
export interface SpriteColors {
  hair: string;
  eyes: string;
  mouth: string;
  clothing: string;
  glasses: string;
  hat: string;
  accessories: string;
}

/** One drawable sprite variant. */
export type Sprite = (c: SpriteColors) => string;

/** Variant names per group, in the order DiceBear lists them. */
export const SPRITE_NAMES = {
  accessories: ["variant04", "variant03", "variant02", "variant01"],
  beard: ["variant08", "variant07", "variant06", "variant05", "variant04", "variant03", "variant02", "variant01"],
  clothing: ["variant23", "variant22", "variant21", "variant20", "variant19", "variant18", "variant17", "variant16", "variant15", "variant14", "variant13", "variant12", "variant11", "variant10", "variant09", "variant08", "variant07", "variant06", "variant05", "variant04", "variant03", "variant02", "variant01"],
  eyes: ["variant12", "variant11", "variant10", "variant09", "variant08", "variant07", "variant06", "variant05", "variant04", "variant03", "variant02", "variant01"],
  glasses: ["light07", "light06", "light05", "light04", "light03", "light02", "light01", "dark07", "dark06", "dark05", "dark04", "dark03", "dark02", "dark01"],
  hair: ["short24", "short23", "short22", "short21", "short20", "short19", "short18", "short17", "short16", "short15", "short14", "short13", "short12", "short11", "short10", "short09", "short08", "short07", "short06", "short05", "short04", "short03", "short02", "short01", "long21", "long20", "long19", "long18", "long17", "long16", "long15", "long14", "long13", "long12", "long11", "long10", "long09", "long08", "long07", "long06", "long05", "long04", "long03", "long02", "long01"],
  hat: ["variant10", "variant09", "variant08", "variant07", "variant06", "variant05", "variant04", "variant03", "variant02", "variant01"],
  mouth: ["sad10", "sad09", "sad08", "sad07", "sad06", "sad05", "sad04", "sad03", "sad02", "sad01", "happy13", "happy12", "happy11", "happy10", "happy09", "happy08", "happy07", "happy06", "happy05", "happy04", "happy03", "happy02", "happy01"],
} as const;

/** DiceBear's own colour lists, kept so the faces stay in their palette. */
export const SPRITE_PALETTES = {
  skin: ["#ffdbac", "#f5cfa0", "#eac393", "#e0b687", "#cb9e6e", "#b68655", "#a26d3d", "#8d5524"],
  hair: ["#cab188", "#603a14", "#83623b", "#a78961", "#611c17", "#603015", "#612616", "#28150a", "#009bbd", "#bd1700", "#91cb15"],
  eyes: ["#76778b", "#697b94", "#647b90", "#5b7c8b", "#588387", "#876658"],
  mouth: ["#d29985", "#c98276", "#e35d6a", "#de0f0d"],
  clothing: ["#5bc0de", "#428bca", "#03396c", "#88d8b0", "#44c585", "#00b159", "#ff6f69", "#d11141", "#ae0001", "#ffeead", "#ffd969", "#ffc425"],
  glasses: ["#4b4b4b", "#323232", "#191919", "#43677d", "#5f705c", "#a04b5d"],
  hat: ["#2e1e05", "#2663a3", "#989789", "#3d8a6b", "#cc6192", "#614f8a", "#a62116"],
  accessories: ["#daa520", "#ffd700", "#fafad2", "#d3d3d3", "#a9a9a9"],
} as const;

export const accessories: Record<string, Sprite> = {
variant04: (c) => `<path d="M2 7h1v1H2zM13 7h1v1h-1z" fill="${c.accessories}"/>`,
    variant03: (c) => `<path d="M13 7h1v2h-1zM2 7h1v2H2z" fill="${c.accessories}"/>`,
    variant02: (c) => `<path fill="${c.accessories}" d="M13 7h1v2h-1zM2 7h1v2H2z"/><path fill="#fff" fill-opacity=".5" d="M2 7h1v1H2zM13 7h1v1h-1z"/>`,
    variant01: (c) => `<path d="M13 7h2v2h-2zM1 7h2v2H1z" fill="${c.accessories}"/>`,
};

export const beard: Record<string, Sprite> = {
variant08: (c) => `<mask id="beardVariant08-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="6" width="10" height="6"><path opacity=".9" d="M3 6h1v3h8V6h1v5h-1v1H4v-1H3V6Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant08-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant07: (c) => `<mask id="beardVariant07-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="9" width="10" height="3"><path opacity=".9" d="M3 9v2h1v1h8v-1h1V9H3Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant07-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant06: (c) => `<mask id="beardVariant06-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="9" width="10" height="3"><path opacity=".9" d="M3 9h3v1h4V9h3v2h-1v1H4v-1H3V9Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant06-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant05: (c) => `<mask id="beardVariant05-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="6" width="10" height="6"><path opacity=".9" d="M3 6h1v2h1v1h6V8h1V6h1v5h-1v1H4v-1H3V6Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant05-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant04: (c) => `<mask id="beardVariant04-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="6" y="11" width="4" height="1"><path opacity=".9" fill="${c.hair}" d="M6 11h4v1H6z"/></mask><g mask="url(#beardVariant04-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant03: (c) => `<mask id="beardVariant03-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="9" width="10" height="5"><path opacity=".9" d="M3 9h2v1h6V9h2v2h-1v2h-1v1H5v-1H4v-2H3V9Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant03-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant02: (c) => `<mask id="beardVariant02-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="5" y="11" width="6" height="3"><path opacity=".9" d="M5 11h6v1h-1v1H9v1H7v-1H6v-1H5v-1Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant02-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
    variant01: (c) => `<mask id="beardVariant01-a" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="3" y="8" width="10" height="4"><path opacity=".9" d="M3 8h2v1h1v1h4V9h1V8h2v3h-1v1H4v-1H3V8Z" fill="${c.hair}"/></mask><g mask="url(#beardVariant01-a)"><path fill="${c.hair}" d="M0 0h16v16H0z"/><path fill="#fff" fill-opacity=".3" d="M0 0h16v16H0z"/></g>`,
};

export const clothing: Record<string, Sprite> = {
variant23: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".2" d="M4 13h1v3H4zM11 13h1v3h-1z"/>`,
    variant22: (c) => `<path d="M6 13H4v3h2v-3ZM12 13h-2v3h2v-3Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".2" d="M5 13h1v3H5zM10 13h1v3h-1z"/>`,
    variant21: (c) => `<path d="M5 13H4v3h3v-1H6v-1H5v-1ZM12 13h-1v1h-1v1H9v1h3v-3Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".5" d="M4 13h1v1H4zM5 14h1v1H5zM6 15h1v1H6zM9 15h1v1H9zM10 14h1v1h-1z"/><path fill="#fff" fill-opacity=".3" d="M11 14h1v1h-1z"/><path fill="#fff" fill-opacity=".5" d="M11 13h1v1h-1z"/><path fill="#fff" fill-opacity=".3" d="M10 15h1v1h-1zM5 15h1v1H5zM4 14h1v1H4z"/>`,
    variant20: (c) => `<path fill="${c.clothing}" d="M4 14h8v2H4z"/><path fill="#fff" fill-opacity=".3" d="M4 14h1v2H4zM11 14h1v2h-1z"/>`,
    variant19: (c) => `<path d="M4 13h1v1h6v-1h1v3H4v-3Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".3" d="M9 15h2v1H9z"/>`,
    variant18: (c) => `<path d="M4 13h2v1h1v1h2v-1h1v-1h2v3H4v-3Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".3" d="M10 14h1v1h-1zM11 13h1v1h-1zM9 15h1v1H9z"/><path fill="#fff" fill-opacity=".5" d="M9 14h1v1H9zM10 13h1v1h-1zM8 15h1v1H8z"/><path fill="#fff" fill-opacity=".3" d="M6 14H5v1h1zM5 13H4v1h1zM7 15H6v1h1z"/><path fill="#fff" fill-opacity=".5" d="M7 14H6v1h1zM6 13H5v1h1zM8 15H7v1h1z"/>`,
    variant17: (c) => `<path d="M4 13h2v1h1v1h2v-1h1v-1h2v1h1v2H3v-2h1v-1Z" fill="${c.clothing}"/>`,
    variant16: (c) => `<path d="M5 13H3v1H2v2h5v-1H6v-1H5v-1ZM13 13h-2v1h-1v1H9v1h5v-2h-1v-1Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".3" d="M11 13h1v1h-1zM10 14h1v1h-1zM9 15h1v1H9zM6 15h1v1H6zM5 14h1v1H5zM4 13h1v1H4z"/>`,
    variant15: (c) => `<path d="M6 14H4v1H3v1h4v-1H6v-1ZM12 15h1v1H9v-1h1v-1h2v1Z" fill="${c.clothing}"/>`,
    variant14: (c) => `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1h-1v1H6v-1H5v-1Z" fill="${c.clothing}"/>`,
    variant13: (c) => `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1H5v-1Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".3" d="M2 14h1v2H2zM6 14h1v2H6zM8 14h1v2H8zM10 14h1v2h-1zM4 13h1v3H4zM12 13h1v3h-1z"/>`,
    variant12: (c) => `<path d="M7 12h2v1h4v1h1v2H2v-2h1v-1h4v-1Z" fill="${c.clothing}"/><path fill="#000" fill-opacity=".3" d="M7 12h2v1H7z"/>`,
    variant11: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h1v1h2v-1h1v-1Z" fill="${c.clothing}"/>`,
    variant10: (c) => `<path d="M4 13h1v1h6v-1h1v1h1v2H3v-2h1v-1Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".5" d="M9 15h2v1H9z"/>`,
    variant09: (c) => `<path d="M4 13h1v2h6v-2h1v2h1v1H3v-1h1v-2Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".2" d="M4 13h1v2H4zM11 13h1v2h-1z"/>`,
    variant08: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v2h4v-2Z" fill="${c.clothing}"/>`,
    variant07: (c) => `<path d="M5 13H4v3h3v-1H6v-1H5v-1ZM12 13h-1v1h-1v1H9v1h3v-3Z" fill="${c.clothing}"/>`,
    variant06: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".2" d="M3 13h1v1H3zM2 14h1v1H2zM3 15h1v1H3zM4 14h1v1H4zM5 13h1v1H5zM5 15h1v1H5zM6 14h1v1H6zM7 15h1v1H7zM8 14h1v1H8zM9 15h1v1H9zM10 14h1v1h-1zM11 15h1v1h-1zM11 13h1v1h-1zM12 14h1v1h-1zM13 15h1v1h-1z"/>`,
    variant05: (c) => `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1h-1v1H6v-1H5v-1Z" fill="${c.clothing}"/>`,
    variant04: (c) => `<path d="M5 13H3v1H2v2h12v-2h-1v-1h-2v1H5v-1Z" fill="${c.clothing}"/>`,
    variant03: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${c.clothing}"/>`,
    variant02: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v2h4v-2Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".2" d="M5 14h1v1H5zM4 15h1v1H4zM7 15h1v1H7zM3 13h1v1H3zM2 14h1v1H2zM12 13h1v1h-1zM11 14h1v1h-1zM10 15h1v1h-1zM13 15h1v1h-1z"/>`,
    variant01: (c) => `<path d="M10 13h3v1h1v2H2v-2h1v-1h3v1h4v-1Z" fill="${c.clothing}"/><path fill="#fff" fill-opacity=".2" d="M11 14h1v2h-1zM4 14h1v2H4z"/>`,
};

export const eyes: Record<string, Sprite> = {
variant12: (c) => `<g fill-rule="evenodd" clip-rule="evenodd"><path d="M5 6h1v2H4V7h1V6Zm5 0h1v2H9V7h1V6Z" fill="#fff"/><path d="M6 6v1H5v1h2V6H6Zm5 0v1h-1v1h2V6h-1Z" fill="${c.eyes}"/><path d="M6 6v1h1V6H6ZM5 7v1h1V7H5Zm6-1v1h1V6h-1Zm-1 1v1h1V7h-1Z" fill="#fff" fill-opacity=".5"/></g>`,
    variant11: (c) => `<path fill="#fff" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${c.eyes}" d="M4 6h2v1H4zM9 6h2v1H9z"/><path fill="#fff" fill-opacity=".7" d="M4 6h1v1H4zM9 6h1v1H9z"/>`,
    variant10: (c) => `<path fill="#fff" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${c.eyes}" d="M10 5h2v2h-2zM5 5h2v2H5z"/><path fill="#fff" fill-opacity=".4" d="M5 5h1v1H5zM6 6h1v1H6zM10 5h1v1h-1zM11 6h1v1h-1z"/><path fill="#fff" fill-opacity=".7" d="M11 5h1v1h-1zM6 5h1v1H6z"/>`,
    variant09: (c) => `<path fill="#fff" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${c.eyes}" d="M10 6h1v1h-1zM5 6h1v1H5z"/>`,
    variant08: (c) => `<path fill="#fff" d="M4 5h3v2H4zM9 5h3v2H9z"/><path fill="${c.eyes}" d="M9 6h1v1H9zM4 6h1v1H4z"/>`,
    variant07: (c) => `<path fill="#fff" d="M4 5h3v2H4zM9 5h3v2H9z"/><path fill="${c.eyes}" d="M11 6h1v1h-1zM6 6h1v1H6z"/>`,
    variant06: (c) => `<path fill="#fff" d="M4 5h3v2H4z"/><path fill="${c.eyes}" d="M5 6h1v1H5z"/><path fill="#fff" d="M9 5h3v2H9z"/><path fill="${c.eyes}" d="M10 6h1v1h-1z"/>`,
    variant05: (c) => `<path fill="#fff" d="M4 5h3v2H4zM9 5h3v2H9z"/><path d="M11 5h-1v1H9v1h3V6h-1V5Z" fill="${c.eyes}"/><path fill="#fff" fill-opacity=".5" d="M9 6h1v1H9zM10 5h1v1h-1zM11 6h1v1h-1z"/><path d="M6 5H5v1H4v1h3V6H6V5Z" fill="${c.eyes}"/><path fill="#fff" fill-opacity=".5" d="M4 6h1v1H4zM5 5h1v1H5zM6 6h1v1H6z"/>`,
    variant04: (c) => `<path d="M6 5H5v2h2V6H6V5ZM11 5h-1v2h2V6h-1V5Z" fill="#fff"/><path fill="${c.eyes}" d="M5 6h1v1H5zM10 6h1v1h-1z"/>`,
    variant03: (c) => `<path d="M10 5h1v2H9V6h1V5ZM5 5h1v2H4V6h1V5Z" fill="#fff"/><path fill="${c.eyes}" d="M11 6h-1v1h1zM6 6H5v1h1z"/>`,
    variant02: (c) => `<g fill-rule="evenodd" clip-rule="evenodd"><path d="M11 5h-1v2h2V6h-1V5ZM6 5H5v2h2V6H6V5Z" fill="#fff"/><path d="M10 5v1h1v1H9V5h1ZM5 5v1h1v1H4V5h1Z" fill="${c.eyes}"/><path d="M10 5v1H9V5h1Zm1 1v1h-1V6h1ZM5 5v1H4V5h1Zm1 1v1H5V6h1Z" fill="#fff" fill-opacity=".5"/></g>`,
    variant01: (c) => `<path fill="#fff" d="M12 5H9v3h3zM7 5H4v3h3z"/><path fill="${c.eyes}" d="M12 6h-2v1h2zM7 6H5v1h2z"/><path fill="#fff" fill-opacity=".7" d="M12 6h-1v1h1zM7 6H6v1h1z"/>`,
};

export const glasses: Record<string, Sprite> = {
light07: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 4H9v1H7V4H4v1H2v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5h-2V4Zm0 1v3H9V5h3ZM7 8H4V5h3v3Z" fill="${c.glasses}"/><path fill="#fff" fill-opacity=".3" d="M9 5h3v3H9zM4 5h3v3H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/>`,
    light06: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H2Zm10 3H9V6h3v2ZM7 8H4V6h3v2Z" fill="${c.glasses}"/><path fill="#fff" fill-opacity=".3" d="M9 6h3v2H9zM4 6h3v2H4z"/><path fill="#fff" fill-opacity=".2" d="M7 5h2v1H7zM2 5h2v1H2zM12 5h2v1h-2z"/>`,
    light05: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H9v1H7V5H2Zm5 1v2H4V6h3Zm2 0v2h3V6H9Z" fill="${c.glasses}"/><path fill="#fff" fill-opacity=".3" d="M4 6h3v2H4zM9 6h3v2H9z"/><path fill="#fff" fill-opacity=".2" d="M2 5h2v1H2zM12 5h2v1h-2z"/>`,
    light04: (c) => `<path fill="#fff" fill-opacity=".3" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${c.glasses}" d="M3 5h1v1H3zM7 5h2v1H7zM12 5h1v1h-1z"/>`,
    light03: (c) => `<path fill="${c.glasses}" d="M2 5h12v1H2zM3 7h10v1H3zM3 6h1v1H3zM12 6h1v1h-1z"/><path fill="#fff" fill-opacity=".3" d="M4 6h8v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M7 6h2v1H7z"/>`,
    light02: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M14 5H2v1h1v2h4V7h2v1h4V6h1V5Zm-2 1H9v1h3V6ZM7 7H4V6h3v1Z" fill="${c.glasses}"/><path fill="#fff" fill-opacity=".3" d="M4 6h3v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM7 5h2v1H7zM13 5h1v1h-1z"/><path fill="#fff" fill-opacity=".3" d="M9 6h3v1H9z"/>`,
    light01: (c) => `<path d="M2 5h5v1H4v1H3V6H2V5ZM7 7v1H4V7h3ZM9 7H7V6h2v1ZM12 7H9v1h3V7ZM12 6H9V5h5v1h-1v1h-1V6Z" fill="${c.glasses}"/><path fill="#fff" fill-opacity=".3" d="M4 6h3v1H4zM9 6h3v1H9z"/><path fill="#fff" fill-opacity=".2" d="M12 5h2v1h-2zM2 5h2v1H2zM7 6h2v1H7z"/>`,
    dark07: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M12 4H9v1H7V4H4v1H2v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5h-2V4Zm0 1v3H9V5h3ZM7 8H4V5h3v3Z" fill="${c.glasses}"/><path fill="#000" fill-opacity=".3" d="M9 5h3v3H9zM4 5h3v3H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/>`,
    dark06: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H2Zm10 3H9V6h3v2ZM7 8H4V6h3v2Z" fill="${c.glasses}"/><path fill="#000" fill-opacity=".3" d="M9 6h3v2H9zM4 6h3v2H4z"/><path fill="#fff" fill-opacity=".2" d="M7 5h2v1H7zM2 5h2v1H2zM12 5h2v1h-2z"/>`,
    dark05: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M2 5v1h1v2h1v1h3V8h2v1h3V8h1V6h1V5H9v1H7V5H2Zm5 1v2H4V6h3Zm2 0v2h3V6H9Z" fill="${c.glasses}"/><path fill="#000" fill-opacity=".3" d="M4 6h3v2H4zM9 6h3v2H9z"/><path fill="#fff" fill-opacity=".2" d="M2 5h2v1H2zM12 5h2v1h-2z"/>`,
    dark04: (c) => `<path fill="#000" fill-opacity=".3" d="M4 5h3v3H4zM9 5h3v3H9z"/><path fill="${c.glasses}" d="M3 5h1v1H3zM7 5h2v1H7zM12 5h1v1h-1z"/>`,
    dark03: (c) => `<path fill="${c.glasses}" d="M2 5h12v1H2zM3 7h10v1H3zM3 6h1v1H3zM12 6h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M4 6h8v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM13 5h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M7 6h2v1H7z"/>`,
    dark02: (c) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M14 5H2v1h1v2h4V7h2v1h4V6h1V5Zm-2 1H9v1h3V6ZM7 7H4V6h3v1Z" fill="${c.glasses}"/><path fill="#000" fill-opacity=".3" d="M4 6h3v1H4z"/><path fill="#fff" fill-opacity=".2" d="M2 5h1v1H2zM7 5h2v1H7zM13 5h1v1h-1z"/><path fill="#000" fill-opacity=".3" d="M9 6h3v1H9z"/>`,
    dark01: (c) => `<path d="M2 5h5v1H4v1H3V6H2V5ZM7 7v1H4V7h3ZM9 7H7V6h2v1ZM12 7H9v1h3V7ZM12 6H9V5h5v1h-1v1h-1V6Z" fill="${c.glasses}"/><path fill="#000" fill-opacity=".3" d="M4 6h3v1H4zM9 6h3v1H9z"/><path fill="#fff" fill-opacity=".2" d="M12 5h2v1h-2zM2 5h2v1H2zM7 6h2v1H7z"/>`,
};

export const hair: Record<string, Sprite> = {
short24: (c) => `<path d="M11 2H5v1h1v1h4V3h1V2ZM3 3h1v2H3V3ZM13 3h-1v2h1V3Z" fill="${c.hair}"/>`,
    short23: (c) => `<path fill="${c.hair}" d="M6 2h4v1H6z"/>`,
    short22: (c) => `<path d="M4 2h8v1h1v2h-2V4H5v1H3V3h1V2Z" fill="${c.hair}"/>`,
    short21: (c) => `<path fill="${c.hair}" d="M7 1h2v2H7z"/>`,
    short20: (c) => `<path d="M6 2h4v1H6zM7 3h2v1H7z" fill="${c.hair}"/>`,
    short19: (c) => `<g fill="${c.hair}"><path d="M4 2h8v1H4zM3 3h3v1H3zM10 3h3v1h-3zM8 3h1v1H8z"/><path d="M8 3h1v1H8z"/></g>`,
    short18: (c) => `<g fill="${c.hair}"><path d="M2 3h2v3H2zM12 3h2v3h-2z"/><path d="M12 3h2v3h-2z"/></g>`,
    short17: (c) => `<g fill="${c.hair}"><path d="M12 3h2v3h-2zM2 3h2v3H2z"/><path d="M3 2h10v2H3z"/><path d="M4 1h8v2H4z"/></g>`,
    short16: (c) => `<g fill="${c.hair}"><path d="M3 2h10v2H3z"/><path d="M4 1h8v2H4z"/></g>`,
    short15: (c) => `<path d="M3 3h10v1H3zM4 2h8v1H4zM2 4h2v2H2zM12 4h2v2h-2z" fill="${c.hair}"/>`,
    short14: (c) => `<path d="M3 4h1v3H3zM12 4h1v3h-1zM3 2h10v2H3z" fill="${c.hair}"/>`,
    short13: (c) => `<g fill="${c.hair}"><path d="M3 2h10v2H3zM2 2h1v1H2zM2 1h1v1H2z"/><path d="M2 2h1v1H2zM13 0h1v1h-1zM2 4h1v1H2zM5 0h1v1H5zM4 1h1v1H4zM6 1h1v1H6zM9 1h1v1H9zM8 0h1v1H8zM12 1h1v1h-1zM13 2h1v1h-1z"/><path d="M12 1h1v1h-1zM14 3h1v1h-1zM13 4h1v1h-1zM1 3h1v1H1z"/></g>`,
    short12: (c) => `<path d="M4 2h1v3H4zM6 2h1v2H6zM8 2h1v2H8zM10 2h1v2h-1z" fill="${c.hair}"/>`,
    short11: (c) => `<g fill="${c.hair}"><path d="M4 2h8v1H4zM3 1h1v1H3zM2 2h1v1H2zM2 3h1v1H2zM2 4h1v1H2zM2 5h1v1H2zM1 3h1v1H1zM1 1h1v1H1zM1 5h1v1H1zM1 6h1v1H1zM0 7h1v1H0zM1 8h1v1H1zM5 1h1v1H5zM6 0h1v1H6zM4 0h1v1H4zM6 1h1v1H6zM7 1h1v1H7zM8 0h1v1H8zM9 1h1v1H9zM9 0h1v1H9zM11 0h1v1h-1zM10 1h1v1h-1zM12 1h1v1h-1zM13 2h1v1h-1zM13 3h1v1h-1zM13 4h1v1h-1zM13 5h1v1h-1zM14 6h1v1h-1zM15 4h1v1h-1z"/><path d="M15 4h1v1h-1zM14 3h1v1h-1zM14 8h1v1h-1zM15 6h1v1h-1zM15 7h1v1h-1zM13 2h1v1h-1zM2 2h1v1H2zM3 1h1v1H3z"/></g>`,
    short10: (c) => `<path d="M3 2h10v1H3zM3 3h2v1H3zM7 1h5v1H7zM13 3h-1v1h1z" fill="${c.hair}"/>`,
    short09: (c) => `<path d="M7 1h5v1H7zM4 2h7v1H4zM3 3h5v1H3z" fill="${c.hair}"/>`,
    short08: (c) => `<path d="M5 1h5v1H5zM4 2h8v1H4zM9 3h1v1H9zM11 3h2v1h-2zM3 3h2v1H3z" fill="${c.hair}"/>`,
    short07: (c) => `<path d="M3 3h1v1H3zM5 2H4v1h1zM12 2h-1v1h1zM13 3h-1v1h1z" fill="${c.hair}"/>`,
    short06: (c) => `<g fill="${c.hair}"><path d="M4 2H3v3h1zM13 2h-1v3h1z"/><path d="M12 1H3v2h9z"/><path d="M4 2H2v2h2zM14 2h-2v2h2z"/></g>`,
    short05: (c) => `<path d="M9 1H8v3h1zM8 2H7v2h1zM10 0H9v3h1zM11 1h-1v1h1z" fill="${c.hair}"/>`,
    short04: (c) => `<path d="M4 3H3v2h1zM13 3h-1v2h1zM12 2H4v1h8z" fill="${c.hair}"/>`,
    short03: (c) => `<path d="M12 2H4v1h8zM13 3h-1v1h1zM6 3H3v1h3zM5 4H3v1h2z" fill="${c.hair}"/>`,
    short02: (c) => `<path d="M12 2H4v1h8zM13 3h-2v1h2zM13 4h-1v1h1zM6 3H3v1h3zM5 4H3v1h2zM4 5H3v1h1z" fill="${c.hair}"/>`,
    short01: (c) => `<path d="M12 2H4v1h8zM13 3H7v1h6zM13 4h-2v1h2zM13 5h-1v1h1zM6 4H3v1h3zM7 3H3v1h4zM5 5H3v1h2zM4 6H3v1h1z" fill="${c.hair}"/>`,
    long21: (c) => `<path d="M13 1H3v1H2v4h1V3h10v3h1V2h-1V1ZM2 8h1v3h1v1H2V8ZM12 11h1V8h1v4h-2v-1Z" fill="${c.hair}"/>`,
    long20: (c) => `<path d="M4 1h8v1h1v1h1v3h-1V4h-1V3H6v1H3v2H2V3h1V2h1V1ZM2 8h1v3h1v1h3v1H2V8ZM12 12H9v1h5V8h-1v3h-1v1Z" fill="${c.hair}"/>`,
    long19: (c) => `<path d="M13 2H3v1H2v3h1V4h10v2h1V3h-1V2ZM3 8H2v1H1v2H0v1h1v-1h1v-1h1V8Z" fill="${c.hair}"/>`,
    long18: (c) => `<path d="M13 2H3v1H2v3h1V4h10v2h1V3h-1V2ZM2 8h1v2H2v1H1V9h1V8ZM1 11v1H0v-1h1ZM16 11h-1V9h-1V8h-1v2h1v1h1v1h1v-1Z" fill="${c.hair}"/>`,
    long17: (c) => `<path d="M5 1h7v1h1v1h1v3h-1V4h-2V3H5v1H4v1H3v1H2v2h1v3h1v1H1V4h1V3h1V2h2V1Z" fill="${c.hair}"/>`,
    long16: (c) => `<path d="M3 1h8v1h2v1h1v3h-1V4h-2V3H6v1H5V3H4v1H3v2H2v2h1v2H1V3h1V2h1V1ZM14 8h-1v2h1V8Z" fill="${c.hair}"/>`,
    long15: (c) => `<g fill="${c.hair}"><path d="M5 0h1v1H5V0Z"/><path d="M2 3h1V1h2v1h1V1h1v1h1V1H7V0h2v2h1V1h1v1h1V1h1v1h1v1h-1v1H4v1H3v1H2V5H1V4h1V3Z"/><path d="M2 3H1V2h1v1ZM1 6H0V5h1v1ZM2 8H1V6h1v2ZM2 8h1v2H2V8Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 4h-1v2h2V5h1V4h-1V3h-1v1Zm0 0h1v1h-1V4Z"/><path d="M12 1h-1V0h1v1ZM13 8h1v2h-1V8Z"/></g>`,
    long14: (c) => `<path d="M5 1H3v1H2v2h1v1h1V4h8v1h1V4h1V2h-1V1h-2v1H5V1Z" fill="${c.hair}"/>`,
    long13: (c) => `<path d="M13 1H3v1H2v1H1v11h2V4h10v10h2V3h-1V2h-1V1Z" fill="${c.hair}"/>`,
    long12: (c) => `<path d="M5 4V3h7v1h1v2h1v2h-1v3h-1v1H9v1h4v1h1v3h1V3h-1V2h-1V1H3v1H2v1H1v14h1v-3h1v-1h4v-1H4v-1H3V8H2V6h1V5h1V4h1Z" fill="${c.hair}"/>`,
    long11: (c) => `<path d="M6 1v1H3v2H2v2h1V5h4V4h3V3h2v1h1v2h1V2h-2V1H6ZM2 8h1v2H2V8ZM14 8h-1v2h1V8Z" fill="${c.hair}"/>`,
    long10: (c) => `<path d="M4 1v1H3v1H2v1H1v6h2V8H2V6h1V4h1V3h2v1h1V3h1V2H7V1H4Z" fill="${c.hair}"/>`,
    long09: (c) => `<path d="M2 1h12v1h1v11h-1v-1h-1V8h1V6h-1V3H3v3H2v2h1v4H2v1H1V2h1V1Z" fill="${c.hair}"/>`,
    long08: (c) => `<path d="M2 1h12v1h1v11h-1v-1h-1V8h1V6h-1V3h-1v1h-1V3H8v1H7v1H6v1H5v1H4v1H3v4H2v1H1V2h1V1Z" fill="${c.hair}"/>`,
    long07: (c) => `<path d="M3 1h10v1h1v1h1v10h-1v-1h-1V8h1V6h-1V4h-1V3H5v1H4v1H3v1H2v2h1v4H2v1H1V3h1V2h1V1Z" fill="${c.hair}"/>`,
    long06: (c) => `<path d="M3 2h10v1h1v3h-1V4H3v2H2V3h1V2ZM13 8h1v1h1v2h-1v-1h-1V8ZM15 11h1v1h-1v-1Z" fill="${c.hair}"/>`,
    long05: (c) => `<path d="M4 0H1v3h2v1H2v2h1V5h2V4h1V3h5v1h1v1h1v1h1V3h-1V2h-1V1H6v1H4V0ZM2 8h1v1H2V8ZM14 8h-1v1h1V8Z" fill="${c.hair}"/>`,
    long04: (c) => `<path d="M12 1H5v1H4v1H3v1H2v2h2V5h1V4h1V3h5v1h1v1h1v1h1V3h-1V2h-1V1ZM13 8h1v4h-2v-1h1V8ZM2 8h1v3h1v1H2V8Z" fill="${c.hair}"/>`,
    long03: (c) => `<path d="M4 2h8v1h1v2h1v6h1v2h-2v-1h-1V5h-1V4H5v1H4v7H3v1H1v-2h1V5h1V3h1V2Z" fill="${c.hair}"/>`,
    long02: (c) => `<path d="M4 2h8v1h1v2h1v7h-1v-1h-1V5h-1V4H5v1H4v6H3v1H2V5h1V3h1V2ZM2 12v1H1v-1h1ZM14 12h1v1h-1v-1Z" fill="${c.hair}"/>`,
    long01: (c) => `<path d="M12 1H5v1H4v1H3v1H2v2h2V5h1V4h1V3h5v1h1v1h1v1h1V3h-1V2h-1V1ZM13 8h1v6h-1v-1H9v-1h3v-1h1V8ZM2 8h1v3h1v1h3v1H3v1H2V8Z" fill="${c.hair}"/>`,
};

export const hat: Record<string, Sprite> = {
variant10: (c) => `<path d="M12 0H4v2H2v3h12V2h-2V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M10 2h1v3h-1zM8 3h1v2H8z"/>`,
    variant09: (c) => `<path d="M4 0h8v1h1v1h1v3H2V2h1V1h1V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M11 2h1v3h-1zM9 2h1v3H9z"/>`,
    variant08: (c) => `<path d="M4 0h8v1h1v1h1v2H2V2h1V1h1V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M12 2v1H9V2z"/>`,
    variant07: (c) => `<path d="M12 1H4v1H3v2h12V3h-2V2h-1V1Z" fill="${c.hat}"/>`,
    variant06: (c) => `<path d="M13 0H3v3H1v1h14V3h-2V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M11 1h1v3h-1z"/>`,
    variant05: (c) => `<path d="M4 0h8v1h1v1h1v2H2V2h1V1h1V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M12 1h1v1h-1zM11 2h1v1h-1zM10 3h1v1h-1zM10 0h1v1h-1zM9 1h1v1H9zM8 2h1v1H8zM7 3h1v1H7z"/>`,
    variant04: (c) => `<path d="M4 0h8v1h1v1h1v3H2V2h1V1h1V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M13 1v1H3V1zM14 3v1H2V3z"/>`,
    variant03: (c) => `<path d="M4 0h8v1h1v1h1v2H2V2h1V1h1V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M13 1v1H3V1zM14 3v1H2V3z"/>`,
    variant02: (c) => `<path d="M12 1H4v1H3v2h12V3h-2V2h-1V1Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M11 4h-1V1h1z"/>`,
    variant01: (c) => `<path d="M4 0h8v1h1v1h1v3H2V2h1V1h1V0Z" fill="${c.hat}"/><path fill="#fff" fill-opacity=".3" d="M5 0h1v1H5zM4 1h1v1H4zM3 2h1v1H3zM2 3h1v1H2z"/>`,
};

export const mouth: Record<string, Sprite> = {
sad10: (c) => `<path d="M7 9v1h1v1h1V9H7Z" fill="${c.mouth}"/>`,
    sad09: (c) => `<path d="M6 10v1h1v-1h3V9H7v1H6Z" fill="${c.mouth}"/>`,
    sad08: (c) => `<path d="M6 9v1h3v1h1v-1H9V9H6Z" fill="${c.mouth}"/>`,
    sad07: (c) => `<path d="M7 9h2v1H7V9Z" fill="${c.mouth}"/>`,
    sad06: (c) => `<path d="M6 9h4v1H6V9Z" fill="${c.mouth}"/>`,
    sad05: (c) => `<path d="M7 9h3v1H7V9Z" fill="${c.mouth}"/>`,
    sad04: (c) => `<path d="M6 9h3v1H6V9Z" fill="${c.mouth}"/>`,
    sad03: (c) => `<path d="M9 9v1H7v1H6v-1h1V9h2Z" fill="${c.mouth}"/>`,
    sad02: (c) => `<path d="M7 9v1h2v1h1v-1H9V9H7Z" fill="${c.mouth}"/>`,
    sad01: (c) => `<path d="M7 9h2v1H7V9ZM7 10v1H6v-1h1ZM9 10v1h1v-1H9Z" fill="${c.mouth}"/>`,
    happy13: (c) => `<path d="M6 10v1h1v1h2v-1h1v-1H9V9H7v1H6Z" fill="${c.mouth}"/><path d="M7 10v1h2v-1H7Z" fill="#fff" fill-opacity=".2"/>`,
    happy12: (c) => `<path d="M6 10v1h1v1h2v-1h1v-1H9V9H7v1H6Z" fill="${c.mouth}"/><path d="M7 10v1h2v-1H7Z" fill="#fff"/>`,
    happy11: (c) => `<path d="M6 9v1h1v1h2v-1H7V9H6Z" fill="${c.mouth}"/>`,
    happy10: (c) => `<path d="M10 9v1H9v1H7v-1h2V9h1Z" fill="${c.mouth}"/>`,
    happy09: (c) => `<path d="M7 11h2v-1H7v1ZM7 10V9H6v1h1ZM9 10V9h1v1H9Z" fill="${c.mouth}"/>`,
    happy08: (c) => `<path d="M6 11v-1h3V9h1v1H9v1H6Z" fill="${c.mouth}"/>`,
    happy07: (c) => `<path d="M10 11v-1H7V9H6v1h1v1h3Z" fill="${c.mouth}"/>`,
    happy06: (c) => `<path d="M6 9v1h1v1h2v-1h1V9H6Z" fill="${c.mouth}"/>`,
    happy05: (c) => `<path d="M7 9v2h2v-1H8V9H7Z" fill="${c.mouth}"/><path d="M9 11v-1H8V9H7v1h1v1h1Z" fill="#fff" fill-opacity=".2"/>`,
    happy04: (c) => `<path d="M9 9v1H8v1h2V9H9Z" fill="${c.mouth}"/>`,
    happy03: (c) => `<path d="M7 9v1h1v1H6V9h1Z" fill="${c.mouth}"/>`,
    happy02: (c) => `<path d="M8 10v1h1v-1H8Z" fill="${c.mouth}"/>`,
    happy01: (c) => `<path d="M7 9v2h2V9H7Z" fill="${c.mouth}"/>`,
};
