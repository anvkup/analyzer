import esbuild from 'esbuild';
import liveServer from 'live-server';
import esbuildSvelte from 'esbuild-svelte';
import { sassPlugin } from 'esbuild-sass-plugin';

import postcss from 'postcss';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import targetBrowsers from './plugins/browserlist.js';

function showEnvInformation() {
    console.log('1 argument required, 0 passed');
    console.log('node esbuild.js development' + '\n' + 'node esbuild.js production');
    process.exit(0);
}

if (process.argv.length < 3) {
    showEnvInformation();
}

if (!['dev', 'prod'].includes(process.argv[2])) {
    showEnvInformation();
}

const production = process.argv[2] === 'prod';

let watch = false;
if (!production) {
    watch = {
        onRebuild(error) {
            if (error) console.error('esbuild: Watch build failed:', error.getMessage());
            else console.log('esbuild: Watch build succeeded');
        },
    };
}

const options = {
    entryPoints: ['./src/index.js'],
    bundle: true,
    watch: watch,
    format: 'iife',
    target: targetBrowsers(),
    minify: production,
    sourcemap: false,
    outfile: './public/build/bundle.js',
    plugins: [
        esbuildSvelte(),
        sassPlugin({
            async transform(source, resolveDir) {
                const { css } = await postcss([tailwind, autoprefixer, postcssPresetEnv({ stage: 0 })]).process(source);
                return css;
            },
        }),
    ],
};

if (!production) {
    const params = {
        port: 5000,
        root: './public',
        open: false,
        wait: 1000,
        logLevel: 2,
    };
    liveServer.start(params);
}

esbuild.build(options).catch((err) => {
    console.error(err);
    process.exit(1);
});
