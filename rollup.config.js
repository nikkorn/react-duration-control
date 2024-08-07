import css from "rollup-plugin-import-css";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
	input: "src/index.ts",
	output: [
		{
			file: pkg.main,
			format: "cjs",
			exports: "named",
			sourcemap: true,
			strict: false
		}
	],
	plugins: [css({ output: "react-duration-control.css" }), typescript()],
	external: ["react", "react-dom"]
};
