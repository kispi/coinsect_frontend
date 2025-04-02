import { DefaultServerError } from '@/types'
import template from './template'
import toast from './toast'

export default {
  bannedUser: (e: DefaultServerError) => {
    if (e.data.message !== 'BANNED_USER') return false

    const u = e.data.extra?.bannedUser
    if (!u) return false

    toast.error(`${template.prettyTime(u.until)}까지 사용이 제한되었습니다. (사유: ${u.reason})`)
    return true
  },
}