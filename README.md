```
sudo npm i --unsafe-perm=true --allow-root
```

---

### Electron

```
sudo npm run electron:mac --unsafe-perm=true --allow-root
npm install electron --verbose
```

### Sharp

```
sudo npm install --arch=x64 --platform=darwin sharp --unsafe-perm=true --allow-root
```

### SASS

```
sudo npm rebuild node-sass --unsafe-perm=true --allow-root
```

# AppStore approve process

https://support.apple.com/en-us/HT204397
https://github.com/electron/electron-notarize

# App Update

# Publishing

GH_TOKEN=\${GH_TOKEN} yarn run electron:publish

# Apple Notarization

https://habr.com/ru/post/455874/
https://cdaringe.com/bsnd-electron
