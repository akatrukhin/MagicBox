![MagicBox - Organize your workspace, keep files optimized](https://katrukhin.com/magic-box/github-header-3.jpg)

#

MagicBox is a tool to minify images, graphics, design source files. Organize a workspace by creating file sets, assign them to project, track file updates, export to project.

#

![ScreenShot](https://katrukhin.com/magic-box/screen-shot-5.png)

## Features

- Icon manager
- Font manager*
- Sketch App files optimization
- Reduce files size:
  - SVG
  - JPEG
  - PNG
  - GIF
  - WEBP
  - TIFF
  - SKETCH
- SVG Editor
- Conver SVG to:
  - Base64 string
  - CSS background (URI encoded)
  - React ready*
  - Serializing CG/UIPaths (iOS, MacOS)
- PX to REM converter*

 *Comming soon
 
 ![ScreenShot](https://katrukhin.com/magic-box/screen-shot-7.png)
 
 #
[![Author](https://img.shields.io/badge/Author-katrukhin-brightgreen.svg)](https://katrukhin.com)
![License: CC-NC](https://img.shields.io/badge/License-CCNC-blue.svg)
[![Donate](https://img.shields.io/badge/Donate-PayPal-brightgreen.svg)](https://paypal.me/katrukhin)
[![Repo Link](https://img.shields.io/badge/Repo-Link-black.svg)](https://github.com/akatrukhin/MagicBox)
 #

## Contributing

Pull Requests are welcome!

### Getting Started

Clone this repository locally:
``` bash
git clone https://github.com/akatrukhin/MagicBox.git
```
Install dependencies with npm:
``` bash
npm install
```
There is an issue with `yarn` and `node_modules` when the application is built by the packager. Please use `npm` as dependencies manager.

### To build for development

**in a terminal window** 
``` bash
npm run electron:local
```

### Included Commands

|Command|Description|
|--|--|
|`npm run electron:local`| Builds your application and start electron |
|`npm run electron:build`| Builds your application and creates an app consumable based on your operating system |
|`npm run electron:mac`| MacOS Build |
|`npm run electron:windows`| Windows Build |
|`npm run electron:linux`| Linux Build |

Please run prettier on all of your PRs before submitting, this can be done with `prettier --write` in the project directory

## License

This project is licensed under the [CC BY-NC 4.0](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Authors

  - **Alexander Katrukhin** - *Provided README Template* -
    [akatrukhin](https://github.com/akatrukhin)
