require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName === "darwin") {
    try {
      const appName = context.packager.appInfo.productFilename;
      const appPath = `${appOutDir}/${appName}.app`;
      console.log("\n");
      console.log("    Notarizing: \n");
      console.log(
        `  • File: ${appName}.app\n  • appBundleId: com.electron.MagicBox\n  • AppleId: ${process.env.APPLEID}\n  • AppleIdPass: ${process.env.APPLEIDPASS}\n`
      );

      await notarize({
        appBundleId: "com.electron.MagicBox",
        appPath,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
      });
      console.log("\n");
      console.log("    Success notarization 🎉 \n");
    } catch (error) {
      console.error("Notarize error: ", error);
    }
  }
};
