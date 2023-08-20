import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import livereload from "rollup-plugin-livereload";
import polyfills from "rollup-plugin-polyfill-node";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-copy";
import gzipPlugin from "rollup-plugin-gzip";
import { svelteSVG } from "rollup-plugin-svelte-svg";
import { brotliCompressSync } from "zlib";
import replace from "@rollup/plugin-replace";
import { config as configDotenv } from 'dotenv';
import ChildProcess from "child_process";

configDotenv();

const production = !process.env.ROLLUP_WATCH;
// const hash = String(
//   ChildProcess.execSync("git rev-parse --short HEAD")
// ).trim(); // append short git commit to bundles
const hash = '0x'

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = ChildProcess.spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: !production,
    format: "iife",
    name: "app",
    file: "build/bundle." + hash + ".js",
    inlineDynamicImports: true,
  },
  plugins: [
    svelteSVG({
      svgo: {},
    }),

    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),

    production && gzipPlugin(),
    production &&
      gzipPlugin({
        customCompression: (content) =>
          brotliCompressSync(Buffer.from(content)),
        fileName: ".br",
      }),

    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle." + hash + ".css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    // builtins(),
    // globals(),
    commonjs({
      include: ["node_modules/**"],
    }),
    json(),
    polyfills(),
    copy({
      targets: [
        {
          src: "src/*.html",
          dest: "build",
          transform: (contents) =>
            contents.toString().replace(/\[hash\]/g, hash),
        },
      ],
    }),

	  copy({ targets: [{ src: "public/*", dest: "build" }] }),
	  replace({ 
        "process.env.NODE_ENV": JSON.stringify(production)
      }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("build"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
    chokidar: {
      usePolling: true,
    },
  },
};
