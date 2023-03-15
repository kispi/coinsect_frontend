import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import useGlobalHooks from './global-hooks'
import useBybit from './websockets/bybit'

const useRealTimePosition = () => {
  const { store } = useGlobalHooks()

  const { subscribe } = useBybit()

  const rtpTimeout = ref(null)

  const connection = ref(null)

  const markets = ref([])

  const sorter = (a, b) => {
    if (
      (a.onAir && b.onAir) ||
      (!a.onAir && !b.onAir)
    ) {
      if (a.entryPrice && !b.entryPrice) return -1

      return Math.abs(a.$$value) > Math.abs(b.$$value) ? -1 : 1
    }

    if (a.onAir) return -1
  }

  const positions = computed(() => {
    const editable = []
    const nonEditable = []
    const tracked = []
    const nonTracked = []
    store.getters.realTimePositions.data.forEach(o => {
      if (o.editable) editable.push(o)
      else nonEditable.push(o)

      if (o.tracking) tracked.push(o)
      else nonTracked.push(o)
    })

    const arrays = [editable, nonEditable, tracked, nonTracked]
    arrays.forEach(arr => arr.sort(sorter))

    return {
      editable,
      nonEditable,
      tracked,
      nonTracked
    }
  })

  const reloadMarkets = () => {
    if (!store.getters.realTimePositions) return []

    const o = {}
    store.getters.realTimePositions.data.forEach(position => {
      if (position.contract) o[position.contract] = true
    })
    markets.value = Object.keys(o)
  }

  const openWebsocket = () => {
    reloadMarkets()
    if (markets.value.length === 0) return

    subscribe({ type: 'instrument_info.100ms', markets: markets.value }).then(conn => connection.value = conn)
  }

  const callApi = async () => {
    try {
      await store.dispatch('loadRealTimePositions')
      openWebsocket()
    } catch (e) {}
    rtpTimeout.value = setTimeout(callApi, 1000 * 60 * 5)
  }

  const onPositionChange = message => {
    if (!message.meta) return

    const newPosition = message.meta
    const updateTarget = (store.getters.realTimePositions.data || []).find(p => p.id === newPosition.id)
    if (!updateTarget) return

    const keys = ['size', 'entryPrice', 'liqPrice', 'markPrice', 'contract', '$$value', '$$unrealized', 'onAir', 'tracking', 'editable', 'lastUpdate']
    keys.forEach(key => updateTarget[key] = newPosition[key])

    reloadMarkets()
    if (connection.value) connection.value.close()
    openWebsocket()
  }

  onMounted(callApi)

  onUnmounted(() => {
    if (store.getters.isSSR) return

    clearTimeout(rtpTimeout.value)

    if (connection.value) connection.value.close()
  })

  watch(
    () => store.getters.chat.lastWebsocketMessage,
    onPositionChange,
  )

  watch(
    () => store.getters.instruments.bybit,
    newVal => {
      if (!newVal) return

      store.getters.realTimePositions.data.forEach(position => {
        position.markPrice = parseFloat((newVal[position.contract] || {}).mark_price || 0)
        if (!position.entryPrice) return

        if (position.size > 0) {
          position.$$unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
        }

        if (position.size < 0) {
          position.$$unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
        }

        position.$$value = position.size * position.markPrice
      })
    },
    { deep: true },
  )

  return {
    positions,
  }
}

export default useRealTimePosition