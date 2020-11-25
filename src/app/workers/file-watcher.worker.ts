/// <reference lib="webworker" />
import { existsSync, watchFile } from "fs";
import { FileStatus } from "../data";

addEventListener('message', ({ data: set }) => {

  const response = `Whatching for ${set.files.length} files`;
  set.files.forEach(file => {
    if (existsSync(file.original.path)) {
      watchFile(file.original.path, (curr, prev) => {
        if (curr.size) {
          if (curr.size !== file.shrinked.size) {
            file.status = FileStatus.needsUpdate;
          }
        } else {
          file.status = FileStatus.removed;
        }
        set.setStatistics();
      });
      if (file.hasSourceFile) {
        if (file.shrinked.path) {
          watchFile(file.shrinked.path, (curr, prev) => {
            if (!curr.size) {
              file.status = FileStatus.needsUpdate;
              set.setStatistics();
            }
          });
        } else {
          file.status = FileStatus.needsUpdate;
        }
      }
    } else {
      file.status = FileStatus.removed;
    }
  });
  postMessage(response);
});
