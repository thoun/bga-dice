import typescript from '@rollup/plugin-typescript';
//import dts from 'rollup-plugin-dts'
//import flatDts from 'rollup-plugin-flat-dts';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts', // Your main entry file
  output: [
    {
      file: 'dist/bga-dice.umd.js',
      format: 'umd',
      name: 'BgaDice',
      // sourcemap: true,
      // plugins: [terser()] // minification
    },
    {
      file: 'dist/bga-dice.esm.js',
      format: 'es',
      // sourcemap: true,
      // plugins: [terser()] // minification
      /*plugins: [flatDts({
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist/',
      },
    })],*/
    },
    /*{
      file: 'dist/bga-dice.d.ts', 
      format: 'es',
      plugins: [dts()],
    },*/
  ],
  plugins: [
    typescript(),
    postcss({
      extensions: ['.css', '.scss'],
      inject: true,
      minimize: true,
      // You might need to configure postcss plugins here if you use them (e.g., autoprefixer)
      // postcss: {}
    })
    // Add other plugins here if needed, e.g., for resolving node_modules dependencies
    // resolve(),
    // commonjs(),
  ]
};