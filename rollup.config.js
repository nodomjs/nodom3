import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import path from "path";
import ts from "rollup-plugin-typescript2";
import {
	terser
} from "rollup-plugin-terser";
const commonOpt = {
		name: 'nodom',
		sourcemap: true
	},
	pluginOpt = {
		...commonOpt,
		plugins: [terser({
			keep_classnames: true,
		})],
	};

export default {
	input: path.join(__dirname, "/index.ts"),
	output: [{
			file: resolve('nodom.esm.js'),
			format: "esm",
			...commonOpt
		},
		{
			file: resolve("nodom.esm.min.js"),
			format: "esm",
			...pluginOpt
		},
		{
			file: resolve("nodom.cjs.js"),
			format: "cjs",
			...commonOpt
		},
		{
			file: resolve("nodom.cjs.min.js"),
			format: "cjs",
			...pluginOpt
		}, {
			file: resolve("nodom.global.js"),
			format: "iife",
			...commonOpt
		}
	],
	plugins: [
		nodeResolve({
			extensions: [".js", ".ts"],
		}),
		ts(),
		commonjs(),
	],
};

function resolve(name) {
	return path.resolve(`dist/${name}`);
}