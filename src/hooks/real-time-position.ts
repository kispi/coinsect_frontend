import { Message, RealTimePosition } from '@/types'
import { onUnmounted, ref, computed, watch } from 'vue'
import useGlobalHooks from './global-hooks'
import useBybit from './websockets/bybit'

const useRealTimePosition = () => {
  const { store } = useGlobalHooks()

  const { subscribe } = useBybit()

  const rtpTimeout = ref<number | null>(null)

  const connection = ref<WebSocket | null>(null)

  const markets = ref<string[]>([])

  const sorter = (a: RealTimePosition, b: RealTimePosition): number => {
    if (
      (a.onAir && b.onAir) ||
      (!a.onAir && !b.onAir)
    ) {
      if (a.entryPrice && !b.entryPrice) return -1

      return Math.abs(a.$$value) > Math.abs(b.$$value) ? -1 : 1
    }

    if (a.onAir) return -1

    return 1
  }

  const positions = computed(() => {
    const editable = [] as RealTimePosition[]
    const nonEditable = [] as RealTimePosition[]
    store.getters.realTimePositions.data.forEach((o: RealTimePosition) => {
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

    const o = {} as Record<RealTimePosition['contract'], boolean>
    store.getters.realTimePositions.data.forEach((position: RealTimePosition) => {
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

  const updatePosition = (realTimePositionsArray: RealTimePosition[], newPosition: RealTimePosition) => {
    const updateTarget = realTimePositionsArray.find(p => p.id === newPosition.id)
    if (!updateTarget) {
      realTimePositionsArray.push(newPosition)
      return
    }

    const keys = ['size', 'entryPrice', 'liqPrice', 'markPrice', 'contract', '$$value', '$$unrealized', 'onAir', 'editable', 'lastUpdate']
    keys.forEach(key => (updateTarget as Record<string, any>)[key] = (newPosition as Record<string, any>)[key])
  }

  const onPositionChange = (message: Message) => {
    const newPosition = message.meta as unknown as Record<string, any>
    if ((newPosition || {}).$$alertType !== 'realTimePosition') return

    if (newPosition.$$deleted) {
      const posIdInDashboard = (((store.getters.dashboardsMain || {}).realTimePositions || {}).data || []).findIndex((p: RealTimePosition) => p.id === newPosition.id)
      if (posIdInDashboard >= 0) store.getters.dashboardsMain.realTimePositions.data.splice(posIdInDashboard, 1)

      const posIdInRealTimePositions = ((store.getters.realTimePositions || {}).data || []).findIndex((p: RealTimePosition) => p.id === newPosition.id)
      if (posIdInRealTimePositions >= 0) store.getters.realTimePositions.data.splice(posIdInRealTimePositions, 1)
      return
    }

    updatePosition((store.getters.realTimePositions || {}).data || [], newPosition as RealTimePosition)
    updatePosition(((store.getters.dashboardsMain || {}).realTimePositions || {}).data || [], newPosition as RealTimePosition)

    reloadMarkets()
    if (connection.value) connection.value.close()
    openWebsocket()
  }

  onUnmounted(() => {
    if (store.getters.isSSR) return

    if (rtpTimeout.value) clearTimeout(rtpTimeout.value)

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

      store.getters.realTimePositions.data.forEach((position: RealTimePosition) => {
        const bybitMarkPrice = (newVal[position.contract] || {}).markPrice
        if (isNaN(position.entryPrice) || !bybitMarkPrice) return

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