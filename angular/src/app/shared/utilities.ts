export const convertSize = (bytes: number): string => {
  let converted: string;
  if (bytes >= 1073741824) {
    converted = (bytes / 1073741824).toFixed(2) + " GB";
  } else if (bytes >= 1048576) {
    converted = (bytes / 1048576).toFixed(2) + " MB";
  } else if (bytes >= 1024) {
    converted = (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes > 1) {
    converted = bytes + " bytes";
  } else if (bytes === 1) {
    converted = bytes + " byte";
  } else {
    converted = "0" + " bytes";
  }
  return converted;
};

export const generateID = (): string => Math.random().toString(36).substr(2, 9);

export const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

export const getPreviewURI = (path: string): string =>
  `${encodeURI(path).replace("(", "%28").replace(")", "%29")}`;

const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;
export const svgCssReady = (data: string): string => {
  data = data.replace(/"/g, `'`);
  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);
  return `background-image: url("data:image/svg+xml,${data.replace(
    symbols,
    encodeURIComponent
  )}");`;
};

export const getEncodedSvgCSSBackground = (data: string): string =>
  `url("data:image/svg+xml,${data
    .replace(/"/g, "'")
    .replace(/>\s{1,}</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/[\r\n%#()<>?\[\\\]^`{|}]/g, encodeURIComponent)}")`;

export const isElectron = (): boolean => {
  return !!(window && window.process && window.process.type);
};
