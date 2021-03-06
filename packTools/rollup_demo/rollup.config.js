import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
export default {
  input: 'src/main.js',
  output: {
    file: 'build/main.js',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [
    resolve(),
    babel({
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**'
    })
  ]
}