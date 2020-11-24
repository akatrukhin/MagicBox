import { shell, Menu, clipboard } from "electron";
import * as url from "url";
import * as path from "path";
import * as parser from "fast-xml-parser";
import * as username from "username";
import { autoUpdater } from "electron-updater";
import { optimizeClipboardSVG } from "./process-image";
import { createWindow, win } from "./window";

export const appMenuInit = () =>
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "MagicBox",
        submenu: [
          {
            label: "About MagicBox",
            click() {
              let about = createWindow({
                windowSize: {
                  width: 300,
                  height: 400,
                  minWidth: 300,
                  minHeight: 400,
                },
              });
              about.loadURL(
                url.format({
                  pathname: path.join(__dirname, "../dist/about.html"),
                  protocol: "file:",
                  slashes: true,
                })
              );
              about.on("closed", () => {
                // Dereference the window object, usually you would store window
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                about = null;
              });
            },
          },
          {
            type: "separator",
          },
          {
            label: "Check for Update...",
            click() {
              autoUpdater.checkForUpdates();
            },
          },
          {
            type: "separator",
          },
          {
            label: "Quit MagicBox",
            accelerator: "CmdOrCtrl+Q",
            role: "quit",
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "copy" },
          // { role: "paste" },
          {
            label: "Paste SVG code",
            accelerator: "CmdOrCtrl+V",
            click() {
              const clipboardData = clipboard.readText();
              if (
                parser.validate(clipboardData) &&
                clipboardData.includes("<svg")
              ) {
                optimizeClipboardSVG("paste-svg-from-clipboard", clipboardData);
              }
            },
          },
        ],
      },
      {
        role: "window",
        submenu: [{ role: "minimize" }, { role: "close" }],
      },
      {
        label: "Help",
        role: "help",
        submenu: [
          {
            click: () => {
              shell.openExternal("https://github.com/akatrukhin/MagicBox");
            },
            label: "Learn more",
          },
          {
            click: () => {
              shell.openItem(
                path.join(
                  "/Users/",
                  username.sync(),
                  "/Library/logs/MagicBox/log.log"
                )
              );
            },
            label: "Open Log",
          },
          {
            click: () => {
              win.webContents.openDevTools();
            },
            label: "Developers Tools",
          },
        ],
      },
    ])
  );
