/**
 * Custom angular webpack configuration
 */
const WorkerPlugin = require("worker-plugin");
const NodeTargetPlugin = require("webpack/lib/node/NodeTargetPlugin");

module.exports = (config, options) => {
  config.target = "electron-renderer";

  if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== "src/environments/environment.ts") {
        continue;
      }

      let fileReplacementParts = fileReplacement["with"].split(".");
      if (
        fileReplacementParts.length > 1 &&
        ["web"].indexOf(fileReplacementParts[1]) >= 0
      ) {
        config.target = "web";
      }
      break;
    }
  }

  let workerPlugin = config.plugins.find((p) => p instanceof WorkerPlugin);
  if (workerPlugin) {
    workerPlugin.options.plugins.push(new NodeTargetPlugin());
  }

  return config;
};
