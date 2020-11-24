import * as os from "os";
import * as settings from "electron-settings";
import * as SVGO from "svgo";
import { systemPreferences } from "electron";

export const SKETCH_APP_ROOT =
  os.homedir() + "/Library/Application Support/MagicBox/";

const SVGO_SETTINGS = {
  removeDoctype: true,
  removeXMLProcInst: true,
  removeComments: true,
  removeMetadata: true,
  removeEditorsNSData: true,
  cleanupAttrs: true,
  inlineStyles: true,
  minifyStyles: true,
  convertStyleToAttrs: true,
  cleanupIDs: true,
  removeUselessDefs: true,
  cleanupListOfValues: true,
  cleanupNumericValues: true,
  convertColors: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeViewBox: true,
  cleanupEnableBackground: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  convertShapeToPath: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  convertPathData: true,
  convertTransform: true,
  removeEmptyAttrs: true,
  removeEmptyContainers: true,
  mergePaths: true,
  removeUnusedNS: true,
  sortAttrs: true,
  removeTitle: true,
  removeDesc: true,
  removeDimensions: true,
  removeStyleElement: true,
  removeScriptElement: true,
};

export const DEFAULT_APP_SETTINGS = {
  app: {
    notification: true,
    suffix: true,
    updateCheck: true,
    clipboardWatcher: false,
    fileWatcher: false,
  },
  appearance: {
    theme: "ultra-dark",
    // theme: systemPreferences.getEffectiveAppearance() === "light" ? "light" : "ultra-dark",
    smallNav: false,
  },
  // Image Settings
  images: {
    jpeg: {
      quality: 56,
    },
    webp: {
      quality: 55,
      alpha: 55,
    },
    tiff: {
      quality: 55,
    },
    svg: {
      precision: 1,
    },
  },
  other: {
    // The last user session router path
    path: "",
  },
  sets: [
    {
      name: "Demo Icon Set",
      id: "2xeu8rxh4",
      viewMode: "grid",
      files: [
        {
          id: "3feuvrwl5",
          status: "optimized",
          hasSourceFile: true,
          original: {
            data: `
              <?xml version="1.0" encoding="UTF-8"?>
              <svg width="285px" height="273px" viewBox="0 0 285 273" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <title>121 Insert Oval Flat</title>
                  <defs>
                      <filter x="-81.1%" y="-81.1%" width="262.2%" height="262.2%" filterUnits="objectBoundingBox" id="filter-1">
                          <feGaussianBlur stdDeviation="20" in="SourceGraphic"></feGaussianBlur>
                      </filter>
                      <filter x="-65.9%" y="-60.6%" width="231.9%" height="221.2%" filterUnits="objectBoundingBox" id="filter-2">
                          <feGaussianBlur stdDeviation="20" in="SourceGraphic"></feGaussianBlur>
                      </filter>
                      <filter x="-70.6%" y="-69.8%" width="241.2%" height="239.5%" filterUnits="objectBoundingBox" id="filter-3">
                          <feGaussianBlur stdDeviation="20" in="SourceGraphic"></feGaussianBlur>
                      </filter>
                    </defs>
                    <g id="Behance" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g id="121-Insert-Oval-Flat" transform="translate(60.000000, 50.000000)" fill-rule="nonzero">                            <path d="M91,77.92 C91,99.38 101.36,109 132.44,109 L165,109 L165,35 L91,35 L91,77.92 Z" id="Path" fill="#556080" opacity="0.201846168" filter="url(#filter-1)"></path>
                        <path d="M91,68.41 L57.33,10 L0,109 L58.24,109 C63.7,91.18 70.98,80.29 91,80.29" id="Path" fill="#434C6D" opacity="0.201846168" filter="url(#filter-2)"></path>
                        <path d="M134,120 C134,144.08 115.3,163 91.5,163 C67.7,163 49,144.08 49,120 C49,95.92 67.7,77 91.5,77 C115.3,77 134,95.92 134,120" id="Path" fill="#25B99A" opacity="0.201846168" filter="url(#filter-3)"></path>
                        <path d="M91,67.92 C91,89.38 101.36,99 132.44,99 L165,99 L165,25 L91,25 L91,67.92 Z" id="Path" fill="#556080"></path>
                        <path d="M91,58.41 L57.33,0 L0,99 L58.24,99 C63.7,81.18 70.98,70.29 91,70.29" id="Path" fill="#434C6D"></path>
                        <path d="M134,110 C134,134.08 115.3,153 91.5,153 C67.7,153 49,134.08 49,110 C49,85.92 67.7,67 91.5,67 C115.3,67 134,85.92 134,110" id="Path" fill="#25B99A"></path>
                      </g>
                  </g>
              </svg>`,
            lastModified: 1603739943243,
            name: "SVG Sample",
            path: undefined,
            size: 2118,
            type: "image/svg+xml",
          },
          shrinked: {
            data: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 273"><defs><filter id="a" width="262.2%" height="262.2%" x="-81.1%" y="-81.1%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceGraphic" stdDeviation="20"/></filter><filter id="b" width="231.9%" height="221.2%" x="-65.9%" y="-60.6%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceGraphic" stdDeviation="20"/></filter><filter id="c" width="241.2%" height="239.5%" x="-70.6%" y="-69.8%" filterUnits="objectBoundingBox"><feGaussianBlur in="SourceGraphic" stdDeviation="20"/></filter></defs><g fill="none" fill-rule="nonzero"><path fill="#556080" d="M91 78c0 21.4 10.4 31 41.4 31H165V35H91v43z" filter="url(#a)" opacity=".2" transform="translate(60 50)"/><path fill="#434C6D" d="M91 68.4L57.3 10 0 109h58.2C63.7 91.2 71 80.3 91 80.3" filter="url(#b)" opacity=".2" transform="translate(60 50)"/><path fill="#25B99A" d="M134 120c0 24-18.7 43-42.5 43S49 144 49 120s18.7-43 42.5-43S134 96 134 120" filter="url(#c)" opacity=".2" transform="translate(60 50)"/><path fill="#556080" d="M151 118c0 21.4 10.4 31 41.4 31H225V75h-74v43z"/><path fill="#434C6D" d="M151 108.4L117.3 50 60 149h58.2c5.5-17.8 12.8-28.7 32.8-28.7"/><path fill="#25B99A" d="M194 160c0 24-18.7 43-42.5 43S109 184 109 160s18.7-43 42.5-43 42.5 19 42.5 43"/></g></svg>`,
            lastModified: 1603739943248,
            name: "SVG Sample",
            path: undefined,
            size: 1301,
            type: "image/svg+xml",
          },
        },
      ],
      statistics: {
        notOptimized: 0,
        totalSavedSpace: 0,
        percentageOfSaved: null,
        totalFilesSize: 0,
      },
    },
  ],
}

export const svgoPluginSettings = (): SVGO => {
  const plugins = Object.keys(SVGO_SETTINGS).map((item) => {
    return {
      [item]: {
        active: SVGO_SETTINGS[item],
      },
    };
  });
  return new SVGO({
    floatPrecision: settings.getSync("images.svg.precision"),
    plugins,
  });
};

export function settingsInitialization() {
  // settings.unsetSync();
  if (!Object.keys(settings.getSync()).length) {
    settings.setSync(DEFAULT_APP_SETTINGS);
  }
}
