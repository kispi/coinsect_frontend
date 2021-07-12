import * as $http from 'axios'
import helpers from '@/helpers'
import { ref } from 'vue'

const useS3Service = () => ({
  progress: ref(null),
  cancelTokenSource: ref(null),
  upload: async function({ continent, prefix, file, type, createFileId }) {
    if (!type) return Promise.reject(`Field 'type' must be specified within one of these: ['file', 'image', 'image_temp']`)

    if (!['file', 'image', 'image_temp'].includes(type)) return Promise.reject(`File type '${type}' is not allowed`)

    let endpoint = 's3/images/temp_upload_url'
    if (type === 'file') endpoint = 's3/files/upload_url'
    if (type === 'image') endpoint = 's3/images/upload_url'
    if (type === 'image_temp') endpoint = 's3/images/temp_upload_url'

    try {
      const data = await $http.get(endpoint, { params: { continent, prefix } })
      const form = new FormData()
      Object.keys(data.params).forEach(key => form.append(helpers.case.toSnake(key), data.params[key]))
      form.append('file', file)

      this.cancelTokenSource.value = $http.CancelToken.source()
      const Authorization = $http.defaults.headers.Authorization
      delete $http.defaults.headers['Authorization']
      const postResponse = await $http.post(data.url, form, {
        responseType: 'document',
        cancelToken: this.cancelTokenSource.value.token,
        onUploadProgress: e => this.progress.value = e.loaded / e.total,
      })
      $http.defaults.headers.Authorization = Authorization

      // 파일의 full url
      const location = postResponse.getElementsByTagName('Location')[0].innerHTML

      // 파일의 앞부분을 제외한 나머지 path
      const key = postResponse.getElementsByTagName('Key')[0].innerHTML
      const result = { location, key, fileName: file.name }
      if (createFileId) {
        // id: DB에 삽입된 이미지 row의 id
        const { id } = await $http.post(`s3/${type}s`, { key })
        result.id = id
      }
      this.progress.value = 0
      return result
    } catch (e) {
      return Promise.reject(e)
    }
  },
})

export default useS3Service