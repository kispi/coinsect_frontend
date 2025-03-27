import useGlobalHooks from './global-hooks'
import communityService from '@/services/community'

const usePost = () => {
  const { helpers, store } = useGlobalHooks()

  const openEditor = ({ post, $$originalPassword }) => {
    if ($$originalPassword) post.$$originalPassword = $$originalPassword

    helpers.modal.custom({
      component: 'ModalPostEditor',
      options: {
        preventCloseOnClickBackdrop: true,
        post,
      },
    })
  }

  const checkPasswordAndAllowEdit = async post => {
    if (store.getters.me && post.userId === store.getters.me.id) return openEditor({ post })

    const password = await helpers.modal.input({ title: '비밀번호를 입력하세요', inputType: 'password', autocomplete: 'post-password' })
    if (!password) return

    try {
      await communityService.checkPassword.post({ sharingKey: post.sharingKey, password })
      post.$$originalPassword = password
      openEditor({ post, $$originalPassword: password })
    } catch (e) {
      helpers.toast.error(helpers.translate('INCORRECT_PASSWORD'))
    }
  }

  return {
    checkPasswordAndAllowEdit,
  }
}

export default usePost