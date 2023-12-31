import { defineConfig, } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

const baseUrl = {
  development: './',
  beta: './',
  release: './'
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }): any => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  // const env = loadEnv(mode, process.cwd(), '')
  let _baseUrl = 'http://localhost'
  // if (mode == 'lzym') _baseUrl = 'http://192.168.0.200'

  return {
    // 在 vite.config.ts 中添加 envDir 属性指定环境文件目录为 env：
    envDir: path.resolve(__dirname, './env'),
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', 'pinia']
      }),
    ],
    base: "./",
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          //打包时移除console
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        }
      }
    },
    server: {
      hmr: true,
      usePolling: false,
      port: 4080,
      host: '0.0.0.0',
      proxy: {
        "/admin": {
          target: _baseUrl + ':4090',//这里是域名，不是完整地址
          changeOrigin: true,//是否跨域
          rewrite: path => path.replace(/^\/admin/, '')
        },
      }
    }
  }
})
