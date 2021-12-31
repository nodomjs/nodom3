"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pluginCommonjs = _interopRequireDefault(require("@rollup/plugin-commonjs"));

var _pluginNodeResolve = _interopRequireDefault(require("@rollup/plugin-node-resolve"));

var _path = _interopRequireDefault(require("path"));

var _rollupPluginTypescript = _interopRequireDefault(require("rollup-plugin-typescript2"));

var _rollupPluginTerser = require("rollup-plugin-terser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  input: _path["default"].join(__dirname, "/index.ts"),
  output: [{
    name: "nodom",
    file: _path["default"].resolve("dist/nodom.esm.js"),
    format: "esm",
    sourcemap: true
  }, {
    name: "nodom",
    file: _path["default"].resolve("dist/nodom.esm.min.js"),
    format: "esm",
    sourcemap: true,
    plugins: [(0, _rollupPluginTerser.terser)()]
  }, {
    name: "nodom",
    file: _path["default"].resolve("dist/nodom.cjs.js"),
    format: "cjs",
    sourcemap: true
  }, {
    name: "nodom",
    file: _path["default"].resolve("dist/nodom.cjs.min.js"),
    format: "cjs",
    sourcemap: true,
    plugins: [(0, _rollupPluginTerser.terser)()]
  }, {
    name: "nodom",
    file: _path["default"].resolve("dist/nodom.global.js"),
    format: "iife",
    sourcemap: true
  }],
  plugins: [(0, _pluginNodeResolve["default"])({
    extensions: [".js", ".ts"]
  }), (0, _rollupPluginTypescript["default"])(), (0, _pluginCommonjs["default"])()]
};
exports["default"] = _default;