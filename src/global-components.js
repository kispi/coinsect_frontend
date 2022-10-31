// app components
import AdSense from '@/components/app/AdSense'
import AdaptiveLayout from '@/components/app/AdaptiveLayout'
import AppBanner from '@/components/app/AppBanner'
import AppCheckbox from '@/components/app/AppCheckbox'
import AppDraggable from '@/components/app/AppDraggable'
import AppDropdown from '@/components/app/AppDropdown'
import AppImg from '@/components/app/AppImg'
import AppLoader from '@/components/app/AppLoader'
import AppLoading from '@/components/app/AppLoading'
import AppLogo from '@/components/app/AppLogo'
import AppPagination from '@/components/app/AppPagination'
import AppSharer from '@/components/app/AppSharer'
import AppSlider from '@/components/app/AppSlider'
import AppToggler from '@/components/app/AppToggler'
import AppTooltip from '@/components/app/AppTooltip'
import AudioRecorder from '@/components/app/AudioRecorder'
import ToastUIEditor from '@/components/app/ToastUIEditor'
import ImageUploader from '@/components/app/ImageUploader'
import WrapperDropdownOverlay from '@/components/app/WrapperDropdownOverlay'

// chat components
import AppChatProfile from '@/components/applications/chat/AppChatProfile'
import BadgeToken from '@/components/applications/chat/BadgeToken'

// common components
import BadgeUnreads from '@/components/common/BadgeUnreads'
import CommunityHeader from '@/components/common/CommunityHeader'
import ModalHeader from '@/components/modals/common-components/ModalHeader'
import ChatStatsLongShort from '@/components/common/ChatStatsLongShort'
import CPortfolio from '@/components/common/c-portfolio/CPortfolio'
import CPosition from '@/components/common/c-position/CPosition'
import LongShortRatio from '@/components/common/LongShortRatio'
import MultiCharts from '@/components/common/MultiCharts'
import OrderbookBybit from '@/components/common/orderbooks/OrderbookBybit'
import OrderbookUpbit from '@/components/common/orderbooks/OrderbookUpbit'
import PostEditor from '@/components/common/post-editor/PostEditor'
import PoweredBy from '@/components/common/PoweredBy'
import SettingsPanel from '@/components/common/SettingsPanel'
import SubHeader from '@/components/common/SubHeader'
import TablePosts from '@/components/common/TablePosts'
import TradingView from '@/components/common/TradingView'
import TradingViewSymbols from '@/components/common/TradingViewSymbols'
import TradingViewTicker from '@/components/common/TradingViewTicker'
import TwitterTimeline from '@/components/common/TwitterTimeline'
import UserSymbol from '@/components/common/UserSymbol'
import WhaleAlert from '@/components/common/whale-alert/WhaleAlert'

// community components
import CommunityButtons from '@/components/views/community/CommunityButtons'
import CReplies from '@/components/views/community/CReplies'
import ReplyWrite from '@/components/views/community/ReplyWrite'

const useGlobalComponents = app => {
  app
  // app components
    .component('AdSense', AdSense)
    .component('AdaptiveLayout', AdaptiveLayout)
    .component('AppBanner', AppBanner)
    .component('AppCheckbox', AppCheckbox)
    .component('AppDraggable', AppDraggable)
    .component('AppDropdown', AppDropdown)
    .component('AppImg', AppImg)
    .component('AppLoader', AppLoader)
    .component('AppLoading', AppLoading)
    .component('AppLogo', AppLogo)
    .component('AppPagination', AppPagination)
    .component('AppSharer', AppSharer)
    .component('AppSlider', AppSlider)
    .component('AppToggler', AppToggler)
    .component('AppTooltip', AppTooltip)
    .component('AudioRecorder', AudioRecorder)
    .component('ToastUIEditor', ToastUIEditor)
    .component('ImageUploader', ImageUploader)
    .component('WrapperDropdownOverlay', WrapperDropdownOverlay)

    // chat components
    .component('AppChatProfile', AppChatProfile)
    .component('BadgeToken', BadgeToken)

    // common components
    .component('BadgeUnreads', BadgeUnreads)
    .component('CommunityHeader', CommunityHeader)
    .component('ChatStatsLongShort', ChatStatsLongShort)
    .component('CPortfolio', CPortfolio)
    .component('CPosition', CPosition)
    .component('LongShortRatio', LongShortRatio)
    .component('MultiCharts', MultiCharts)
    .component('ModalHeader', ModalHeader)
    .component('OrderbookBybit', OrderbookBybit)
    .component('OrderbookUpbit', OrderbookUpbit)
    .component('PostEditor', PostEditor)
    .component('PoweredBy', PoweredBy)
    .component('SettingsPanel', SettingsPanel)
    .component('SubHeader', SubHeader)
    .component('TablePosts', TablePosts)
    .component('TradingView', TradingView)
    .component('TradingViewSymbols', TradingViewSymbols)
    .component('TradingViewTicker', TradingViewTicker)
    .component('TwitterTimeline', TwitterTimeline)
    .component('UserSymbol', UserSymbol)
    .component('WhaleAlert', WhaleAlert)

    // community components
    .component('CommunityButtons', CommunityButtons)
    .component('CReplies', CReplies)
    .component('ReplyWrite', ReplyWrite)
}

export default useGlobalComponents