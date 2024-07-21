import * as esbuild from 'esbuild';

const srcPath = 'src';
const distPath = 'dist';

/**
 * @type {import("esbuild").CommonOptions}
 */
const config = {
  entryPoints: [`${srcPath}/main.ts`],
  bundle: true,
  platform: 'node',
};

await esbuild.build({
  ...config,
  format: 'cjs',
  outfile: `${distPath}/main.cjs`,
});

await esbuild.build({
  ...config,
  format: 'esm',
  outfile: `${distPath}/main.mjs`,
});
