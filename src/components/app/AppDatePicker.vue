<template>
  <VueDatePicker
    :modelValue="modelValue"
    :format="defaultFormatter"
    :week-start="0"
    @update:modelValue="e => $emit('update:modelValue', e)"
  />
</template>

<script>
// @vuepic/vue-datepicker를 lazyload하기 위한 프록시 컴포넌트
import { onMounted, defineAsyncComponent } from 'vue'
import useGlobalHooks from '@/hooks/global-hooks'

export default {
  props: ['modelValue'],
  components: {
    VueDatePicker: defineAsyncComponent(() => import('@vuepic/vue-datepicker')),
  },
  setup() {
    const { plugins, store } = useGlobalHooks()

    const krList = ['일', '월', '화', '수', '목', '금', '토']

    const defaultFormatter = date => {
      const target = plugins.$helpers.dayjs(date)
      const dayOfWeek = target.day()
      return target.format(`YYYY-MM-DD (${store.getters.settings.locale === 'kr' ? krList[dayOfWeek] : 'ddd'})`)
    }

    onMounted(() => {
      import('@vuepic/vue-datepicker/dist/main.css')
    })

    return {
      defaultFormatter,
    }
  },
}
</script>