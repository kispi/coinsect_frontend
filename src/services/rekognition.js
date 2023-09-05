import { $http } from '@/modules/axios'

const rekognition = {
  imageModeration: {
    create: async ({ url, token }) => {
      try {
        return await $http.post('aws/rekognition/image_moderation', { url, token })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default rekognition