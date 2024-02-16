import { onUnmounted, ref, computed, watch } from 'vue'
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
    store.getters.realTimePositions.data.forEach(o => {
      if (o.editable) editable.push(o)
      else nonEditable.push(o)
    })

    const arrays = [editable, nonEditable]
    arrays.forEach(arr => arr.sort(sorter))

    return {
      editable,
      nonEditable,
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

  // 바이빗과의 웹소켓을 열고, 클라이언트가 갖고있는 store.state.realTimePositions에 현재 시세를 채워넣어 포지션의 손익을 계산한다.
  const openWebsocket = () => {
    reloadMarkets()
    if (markets.value.length === 0) return

    subscribe({ type: 'tickers', markets: markets.value }).then(conn => connection.value = conn)
  }

  const callApi = async () => {
    try {
      await store.dispatch('loadRealTimePositions')
      openWebsocket()
    } catch (e) {}
    rtpTimeout.value = setTimeout(callApi, 1000 * 60 * 5)
  }

  const updatePosition = (realTimePositionsArray, newPosition) => {
    const updateTarget = (realTimePositionsArray || []).find(p => p.id === newPosition.id)
    if (!updateTarget) return

    const keys = ['size', 'entryPrice', 'liqPrice', 'markPrice', 'contract', '$$value', '$$unrealized', 'onAir', 'editable', 'lastUpdate']
    keys.forEach(key => updateTarget[key] = newPosition[key])
  }

  const onPositionChange = message => {
    const newPosition = message.meta
    if (!newPosition) return

    updatePosition((store.getters.realTimePositions || {}).data, newPosition)
    updatePosition(((store.getters.dashboardsMain || {}).realTimePositions || {}).data, newPosition)

    reloadMarkets()
    if (connection.value) connection.value.close()
    openWebsocket()
  }

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
      if (!newVal || !store.getters.realTimePositions) return

      store.getters.realTimePositions.data.forEach(position => {
        const bybitMarkPrice = (newVal[position.contract] || {}).markPrice
        if (isNaN(parseFloat(position.entryPrice)) || !bybitMarkPrice) return

        if (position.size > 0) position.$$unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100
        if (position.size < 0) position.$$unrealized = Math.floor(100 * position.size * (position.markPrice - position.entryPrice)) / 100

        position.markPrice = parseFloat(bybitMarkPrice) || 0
        position.$$value = position.size * position.markPrice || 0
      })
    },
    { deep: true },
  )

  return {
    connection,
    positions,
    sorter,
    openWebsocket,
    callApi,
  }
}

export default useRealTimePosition