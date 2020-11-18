import { IWebWorkerService } from "./web-worker.interface";

export class WebWorkerService implements IWebWorkerService {
  private workerFunctionToUrlMap = new WeakMap<Function, string>();
  private promiseToWorkerMap = new WeakMap<Promise<any>, Worker>();

  run<T>(workerFunction: (input: any) => T, data?: any): Promise<T> {
    const url = this.getOrCreateWorkerUrl(workerFunction);
    return this.runUrl(url, data);
  }

  runUrl(url: string, data?: any): Promise<any> {
    const worker = new Worker(url);
    const promise = this.createPromiseForWorker(worker, data);
    const promiseCleaner = this.createPromiseCleaner(promise);

    this.promiseToWorkerMap.set(promise, worker);

    promise.then(promiseCleaner).catch(promiseCleaner);

    return promise;
  }

  terminate<T>(promise: Promise<T>): Promise<T> {
    return this.removePromise(promise);
  }

  getWorker(promise: Promise<any>): Worker {
    return this.promiseToWorkerMap.get(promise);
  }

  private createPromiseForWorker<T>(worker: Worker, data: any) {
    return new Promise<T>((resolve, reject) => {
      worker.addEventListener("message", (event) => resolve(event.data));
      worker.addEventListener("error", reject);
      worker.postMessage(data);
    });
  }

  private getOrCreateWorkerUrl(fn: Function): string {
    if (!this.workerFunctionToUrlMap.has(fn)) {
      const url = this.createWorkerUrl(fn);
      this.workerFunctionToUrlMap.set(fn, url);
      return url;
    }
    return this.workerFunctionToUrlMap.get(fn);
  }

  private createWorkerUrl(resolve: Function): string {
    const resolveString = resolve.toString();
    const webWorkerTemplate = `
            self.addEventListener('message', function(e) {
                postMessage((${resolveString})(e.data));
            });
        `;
    const blob = new Blob([webWorkerTemplate], { type: "text/javascript" });
    return URL.createObjectURL(blob);
  }

  private createPromiseCleaner<T>(promise: Promise<T>): (input: any) => T {
    return (event) => {
      this.removePromise(promise);
      return event;
    };
  }

  private removePromise<T>(promise: Promise<T>): Promise<T> {
    const worker = this.promiseToWorkerMap.get(promise);
    if (worker) {
      worker.terminate();
    }
    this.promiseToWorkerMap.delete(promise);
    return promise;
  }
}
