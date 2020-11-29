// private watchFile = (file: AppFile, set: Set): void => {
// if (this.settings.getSync("app.fileWatcher")) {
//   console.log(
//     `File check: ${file.original.name}`
//   );
//   if (this.fs.existsSync(file.original.path)) {
//     this.fs.watchFile(file.original.path, (curr, prev) => {
//       if (curr.size) {
//         if (curr.size !== file.shrinked.size) {
//           file.status = FileStatus.needsUpdate;
//         }
//       } else {
//         file.status = FileStatus.removed;
//       }
//       set.setStatistics();
//     });
//     if (file.hasSourceFile) {
//       if (file.shrinked.path) {
//         this.fs.watchFile(file.shrinked.path, (curr, prev) => {
//           if (!curr.size) {
//             file.status = FileStatus.needsUpdate;
//             set.setStatistics();
//           }
//         });
//       } else {
//         file.status = FileStatus.needsUpdate;
//       }
//     }
//   } else {
//     file.status = FileStatus.removed;
//   }
//   set.setStatistics();
//   this.saveSets();
// }
// };

// import * as fs from 'fs';

// declare function importScripts(...urls: string[]): void;
// declare function postMessage(message: any): void;
// export const WATCH_FILE = (input) => {
//   // Allocate required libraries
//   // Since the host may change, we'll request it from the caller
//   importScripts(`${input.protocol}//${input.host}/scripts/fs.full.min.js`);
//   console.log("WATCH_FILE", fs)

// }