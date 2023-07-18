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
import AppSkeleton from '@/components/app/AppSkeleton'
import AppSlider from '@/components/app/AppSlider'
import AppToggler from '@/components/app/AppToggler'
import AppTooltip from '@/components/app/AppTooltip'
import AudioRecorder from '@/components/app/AudioRecorder'
import IconYoutube from '@/components/app/IconYoutube'
import ImageUploader from '@/components/app/ImageUploader'
import ToastUIEditor from '@/components/app/ToastUIEditor'
import WrapperDropdownOverlay from '@/components/app/WrapperDropdownOverlay'

// chat components
import AppChatProfile from '@/components/applications/chat/AppChatProfile'
import BadgeToken from '@/components/applications/chat/BadgeToken'
import IconAddEmoji from '@/components/applications/chat/IconAddEmoji'

// common components
import BadgeUnreads from '@/components/common/BadgeUnreads'
import BannerBitcoinBlog from '@/components/common/BannerBitcoinBlog'
import BannerBingx from '@/components/common/exchange-banners/BannerBingx'
import BannerBybit from '@/components/common/exchange-banners/BannerBybit'
import CommunityHeader from '@/components/common/CommunityHeader'
import ModalHeader from '@/components/modals/common-components/ModalHeader'
import CPortfolio from '@/components/common/c-portfolio/CPortfolio'
import CPosition from '@/components/common/c-position/CPosition'
import FoolsDayPrank from '@/components/common/prank/FoolsDayPrank'
import LongShortRatio from '@/components/common/LongShortRatio'
import MultiCharts from '@/components/common/MultiCharts'
import OrderbookBybit from '@/components/common/orderbooks/OrderbookBybit'
import OrderbookUpbit from '@/components/common/orderbooks/OrderbookUpbit'
import PostEditor from '@/components/common/post-editor/PostEditor'
import PoweredBy from '@/components/common/PoweredBy'
import SettingsPanel from '@/components/common/SettingsPanel'
import TablePosts from '@/components/common/table-posts/TablePosts'
import TradingView from '@/components/common/TradingView'
import TradingViewSymbols from '@/components/common/TradingViewSymbols'
import UserSymbol from '@/components/common/UserSymbol'
import WhaleAlertItem from '@/components/common/whale-alert/WhaleAlertItem'

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
    .component('AppSkeleton', AppSkeleton)
    .component('AppSlider', AppSlider)
    .component('AppToggler', AppToggler)
    .component('AppTooltip', AppTooltip)
    .component('AudioRecorder', AudioRecorder)
    .component('IconYoutube', IconYoutube)
    .component('ImageUploader', ImageUploader)
    .component('ToastUIEditor', ToastUIEditor)
    .component('WrapperDropdownOverlay', WrapperDropdownOverlay)

    // chat components
    .component('AppChatProfile', AppChatProfile)
    .component('BadgeToken', BadgeToken)
    .component('IconAddEmoji', IconAddEmoji)

    // common components
    .component('BadgeUnreads', BadgeUnreads)
    .component('BannerBitcoinBlog', BannerBitcoinBlog)
    .component('BannerBingx', BannerBingx)
    .component('BannerBybit', BannerBybit)
    .component('CommunityHeader', CommunityHeader)
    .component('CPortfolio', CPortfolio)
    .component('CPosition', CPosition)
    .component('FoolsDayPrank', FoolsDayPrank)
    .component('LongShortRatio', LongShortRatio)
    .component('MultiCharts', MultiCharts)
    .component('ModalHeader', ModalHeader)
    .component('OrderbookBybit', OrderbookBybit)
    .component('OrderbookUpbit', OrderbookUpbit)
    .component('PostEditor', PostEditor)
    .component('PoweredBy', PoweredBy)
    .component('SettingsPanel', SettingsPanel)
    .component('TablePosts', TablePosts)
    .component('TradingView', TradingView)
    .component('TradingViewSymbols', TradingViewSymbols)
    .component('UserSymbol', UserSymbol)
    .component('WhaleAlertItem', WhaleAlertItem)

    // community components
    .component('CommunityButtons', CommunityButtons)
    .component('CReplies', CReplies)
    .component('ReplyWrite', ReplyWrite)
}

export default useGlobalComponents