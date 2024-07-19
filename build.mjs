import * as esbuild from 'esbuild';
import config from './esbuild.common.mjs';

await esbuild.build(config);
