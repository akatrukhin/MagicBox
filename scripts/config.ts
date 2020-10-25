import * as os from "os";
import * as settings from "electron-settings";
import * as SVGO from "svgo";

export const SketchPluginsRoot =
  os.homedir() + "/Library/Application Support/MagicBox/";

const SVGOSettings = {
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

export const SVGPluginSettings = (): SVGO => {
  const plugins = Object.keys(SVGOSettings).map((item) => {
    return {
      [item]: {
        active: SVGOSettings[item],
      },
    };
  });
  return new SVGO({
    floatPrecision: settings.get("images.svg.precision"),
    plugins,
  });
};

// Default Application Settings
export const DefaultAppSettings = {
  app: {
    notification: true,
    suffix: true,
    updateCheck: true,
    defaultGridView: true,
    clipboardWatcher: false,
    fileWatcher: true,
  },
  appearance: { theme: "ultra-dark", smallNav: false },
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
    // Restore user path
    path: "",
  },
};

function SettingsApply(obj, stack) {
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === "object") {
        SettingsApply(obj[property], stack + (stack ? "." : "") + property);
      } else {
        if (!settings.has(stack + "." + property)) {
          settings.set(stack + "." + property, obj[property]);
        }
      }
    }
  }
}

export function SettingsInitialization() {
  // settings.deleteAll();
  if (!Object.keys(settings.getAll()).length) {
    settings.setAll(DefaultAppSettings);
  }
}
