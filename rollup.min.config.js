import uglify from 'rollup-plugin-uglify';

export default {
    entry: "./dist/index.js",
    dest: "./dist/bundles/tolefocus.bundle.min.umd.js",
    format: "umd",
    moduleName: "tolefocus",
    plugins: [
        uglify()
    ]
};