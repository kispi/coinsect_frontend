import useGlobalHooks from './global-hooks'
import communityService from '@/services/community'

const usePost = () => {
  const { plugins } = useGlobalHooks()

  const checkPasswordAndAllowEdit = async ({ post }) => {
    const value = await plugins.$modal.input({ title: '비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
    if (!value) return

    try {
      await communityService.checkPassword.post({ sharingKey: post.sharingKey, password: value })
      post.$$originalPassword = value
      plugins.$modal.custom({
        component: 'ModalPostEditor',
        options: {
          preventCloseOnClickBackdrop: true,
          post,
        },
      })
    } catch (e) {
      console.error(e)
      plugins.$toast.error(plugins.$translate('INCORRECT_PASSWORD'))
    }
  }



  return {
    checkPasswordAndAllowEdit,
  }
}

export default usePost