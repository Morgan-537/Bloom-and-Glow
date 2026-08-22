// Named .cjs (not .js) so it's always loaded as CommonJS, regardless of the
// "type": "module" setting in package.json — Jest and Babel both require
// this file to be a plain CommonJS module.
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
