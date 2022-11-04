import { $http } from '@/modules/axios'

const rekognition = {
  imageModeration: {
    create: async url => {
      try {
        return await $http.post('aws/rekognition', { url })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default rekognition