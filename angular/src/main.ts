import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { AppConfig } from "./environments/environment";

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';

if (AppConfig.production) {
  enableProdMode();
}

setTimeout(() => {
  platformBrowserDynamic().bootstrapModule(AppModule, {
    preserveWhitespaces: false,
  });
});
