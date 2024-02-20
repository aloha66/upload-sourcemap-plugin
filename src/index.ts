import fs from 'fs'
import path from 'path'
import http from 'http'
import { createUnplugin } from 'unplugin'
import glob from 'glob'
import { Options } from './types'

function getList(dir: string) {
  return glob.sync(
    //   output生产dist的路径
    // 匹配该路径下所有js.map后缀的文件
    path.join(dir!, './**/*.{js.map,}'),
  )
}

function upload(url: string, file: string) {
  return new Promise<void>((resolve) => {
    const req = http.request(`${url}?name=${path.basename(file)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked',
      },
    })
    fs.createReadStream(file).on('data', (chunk) => {
      req.write(chunk)
    }).on('end', () => {
      req.end()
      resolve()
    })
  })
}

async function handleUpload(options: Options, dir: string) {
  const list = getList(dir!)
  if (!list) return
  const { uploadUrl } = options!
  for (const file of list) {
    try {
      await upload(uploadUrl, file)
      // eslint-disable-next-line no-console
      console.log('上传成功')
    }
    catch (error) {
      console.error('上传失败', error)
    }
  }
}

export default createUnplugin<Options>(options => ({
  name: 'upload-sourcemap-plugin',
  // transformInclude(id) {
  //   return id.endsWith('main.ts')
  // },
  // transform(code) {
  //   return code.replace('__UNPLUGIN__', `Hello Unplugin! ${options}`)
  // },

  rollup: {
    async writeBundle({ dir }) {
      handleUpload(options!, dir!)
    },
  },
  webpack(compiler) {
    compiler.hooks.done.tap('upload-sourcemap-plugin', async(status) => {
      const dir = status.compilation.outputOptions.path || ''
      handleUpload(options!, dir!)
    })
  },
}))
