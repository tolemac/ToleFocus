/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    baseURL: ".",
    paths: {
      // paths serve as alias
      "npm:": "node_modules/"
    },
    // map tells the System loader where to look for things
    map: {
      "./": "../dist/"
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      "./": {
        main: "index.js",
        defaultExtension: "js"
      }
    }
  });
})(this);
