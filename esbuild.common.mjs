const srcPath = 'src';
const distPath = 'dist';

/**
 * @type {import("esbuild").CommonOptions}
 */
const config = {
  entryPoints: [
    `${srcPath}/main.ts`,
  ],
  bundle: true,
  outdir: distPath,
  platform: 'browser'
}

export default config;
