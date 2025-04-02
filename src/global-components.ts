import { App } from 'vue'

// app components
import AdSense from '@/components/app/AdSense.vue'
import AdaptiveLayout from '@/components/app/AdaptiveLayout.vue'
import AppBanner from '@/components/app/AppBanner.vue'
import AppCheckbox from '@/components/app/AppCheckbox.vue'
import AppDraggable from '@/components/app/AppDraggable.vue'
import AppDropdown from '@/components/app/AppDropdown.vue'
import AppImg from '@/components/app/AppImg.vue'
import AppLoader from '@/components/app/AppLoader.vue'
import AppLoading from '@/components/app/AppLoading.vue'
import AppLogo from '@/components/app/AppLogo.vue'
import AppPagination from '@/components/app/AppPagination.vue'
import AppSkeleton from '@/components/app/AppSkeleton.vue'
import AppSlider from '@/components/app/AppSlider.vue'
import AppToggler from '@/components/app/AppToggler.vue'
import AppTooltip from '@/components/app/AppTooltip.vue'
import AudioRecorder from '@/components/app/AudioRecorder.vue'
import IconYoutube from '@/components/app/IconYoutube.vue'
import ImageUploader from '@/components/app/ImageUploader.vue'
import ToastUIEditor from '@/components/app/ToastUIEditor.vue'
import WrapperDropdownOverlay from '@/components/app/WrapperDropdownOverlay.vue'

// chat components
import AppChatProfile from '@/components/applications/chat/AppChatProfile.vue'
import BadgeToken from '@/components/applications/chat/BadgeToken.vue'
import IconAddEmoji from '@/components/applications/chat/IconAddEmoji.vue'

// common components
import BadgeUnreads from '@/components/common/BadgeUnreads.vue'
import BannerBitcoinBlog from '@/components/common/BannerBitcoinBlog.vue'
import CommunityHeader from '@/components/common/CommunityHeader.vue'
import ExchangeBanner from '@/components/common/ExchangeBanner.vue'
import ModalHeader from '@/components/modals/common-components/ModalHeader.vue'
import CPortfolio from '@/components/common/c-portfolio/CPortfolio.vue'
import CPosition from '@/components/common/c-position/CPosition.vue'
import MetaCard from '@/components/common/MetaCard.vue'
import MultiCharts from '@/components/common/MultiCharts.vue'
import OrderbookBybit from '@/components/common/orderbooks/OrderbookBybit.vue'
import OrderbookUpbit from '@/components/common/orderbooks/OrderbookUpbit.vue'
import PostEditor from '@/components/common/post-editor/PostEditor.vue'
import PoweredBy from '@/components/common/PoweredBy.vue'
import SettingsPanel from '@/components/common/SettingsPanel.vue'
import TablePosts from '@/components/common/table-posts/TablePosts.vue'
import TradingView from '@/components/common/TradingView.vue'
import TradingViewSymbols from '@/components/common/TradingViewSymbols.vue'
import UserSymbol from '@/components/common/UserSymbol.vue'
import WhaleAlertItem from '@/components/common/whale-alert/WhaleAlertItem.vue'

// community components
import CommunityButtons from '@/components/views/community/CommunityButtons.vue'
import CReplies from '@/components/views/community/CReplies.vue'
import ReplyWrite from '@/components/views/community/ReplyWrite.vue'

const useGlobalComponents = (app: App) => {
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
    .component('CommunityHeader', CommunityHeader)
    .component('CPortfolio', CPortfolio)
    .component('CPosition', CPosition)
    .component('ExchangeBanner', ExchangeBanner)
    .component('MetaCard', MetaCard)
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