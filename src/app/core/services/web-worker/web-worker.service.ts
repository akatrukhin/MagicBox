import { Injectable } from '@angular/core';
import { FilesSet } from "../../../data"
// Credits to: https://medium.com/swlh/angular-and-web-workers-17cd3bf9acca

@Injectable({
  providedIn: 'root'
})
export class WebWorkerService {
  async startToTrackFilesChanges(setId: string) {
    // if (typeof Worker !== 'undefined') {
    //   const worker = new Worker('../../../workers/file-watcher.worker',
    //     { type: 'module' });

    //   worker.onmessage = ({ data }) => {
    //     console.log(`page got message: ${data}`);
    //   };

    //   worker.postMessage(setId);
    // }
  }
}