import { $http } from '@/modules/axios'

const rekognition = {
  imageModeration: {
    examples: async () => {
      try {
        return await $http.get('aws/rekognition/image_moderation/examples')
      } catch (e) {
        return Promise.reject(e)
      }
    },
    create: async ({ url, token }: { url: string, token: string }) => {
      try {
        return await $http.post('aws/rekognition/image_moderation', { url, token })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}

export default rekognition