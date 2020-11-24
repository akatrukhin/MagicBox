import { Injectable } from "@angular/core";
import { WebWorkerService as WebWorker } from './web-worker';
@Injectable({
  providedIn: "root",
})
export class WebWorkerService extends WebWorker { }
