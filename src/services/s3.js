import * as $http from 'axios'

const s3Service = {
  upload: async function(file) {
    if (!file.type.startsWith('image')) return Promise.reject({ message: 'png, jpg, jpeg, gif, svg 등의 이미지 파일을 사용해주세요' })

    const endpoint = 's3/upload_url'
    try {
      const url = await $http.get(endpoint, { params: { key: `boards/free_board/${encodeURI(file.name)}` } })
      await $http.put(url, file, {
        // 나중에 할 일이 생기면 해도 될듯
        // onUploadProgress: e => this.progress.value = e.loaded / e.total,
        headers: {
          'Content-Type': file.type,
        },
      })
      return url.split('?')[0]
    } catch (e) {
      return Promise.reject(e)
    }
  },
}

export default s3Service