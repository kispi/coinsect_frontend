import { $httpNoAuth } from '@/modules/axios'
import helpers from '@/helpers'

const createError = message => ({ data: { message }})

const s3Service = {
  upload: async function(file, path) {
    if (!path) return Promise.reject(createError('path is required'))

    if (!file.type.startsWith('image')) return Promise.reject(createError('png, jpg, jpeg, gif, svg 등의 이미지 파일을 사용해주세요'))

    try {
      const { url, headers } = await $httpNoAuth.get('aws/s3/upload_url', {
        params: {
          key: `${path}/${encodeURI(file.name)}`,
        },
      })
      await $httpNoAuth.put(url, file, {
        // 나중에 할 일이 생기면 해도 될듯
        // onUploadProgress: e => this.progress.value = e.loaded / e.total,
        headers,
      })
      const s3Url = url.split('?')[0]
      const withoutProtocol = s3Url.split('https://')[1]
      const key = withoutProtocol.split('/').slice(1).join('/')
      return helpers.withCdn(key)
    } catch (e) {
      return Promise.reject(e)
    }
  },
}

export default s3Service