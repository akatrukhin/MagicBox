import { Injectable } from '@angular/core';
import { Set } from "../../../data"
// Credits to: https://medium.com/swlh/angular-and-web-workers-17cd3bf9acca

@Injectable({
  providedIn: 'root'
})
export class WebWorkerService {
  async startToTrackFilesChanges(set: Set) {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('../../../workers/file-watcher.worker',
        { type: 'module' });

      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };

      worker.postMessage(set);
    }
  }
}