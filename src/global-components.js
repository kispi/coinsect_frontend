// app components
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
import AppToggler from '@/components/app/AppToggler'
import AppTooltip from '@/components/app/AppTooltip'
import FileUploader from '@/components/app/FileUploader'
import WrapperDropdownOverlay from '@/components/app/WrapperDropdownOverlay'

// common components
import ButtonCommunity from '@/components/common/ButtonCommunity'
import ModalHeader from '@/components/modals/common-components/ModalHeader'
import OrderbookBybit from '@/components/common/orderbooks/OrderbookBybit'
import OrderbookUpbit from '@/components/common/orderbooks/OrderbookUpbit'
import PostEditor from '@/components/common/post-editor/PostEditor'
import SCoin from '@/components/common/SCoin'
import TablePosts from '@/components/common/TablePosts'
import TradingView from '@/components/common/TradingView'

// community components
import CommunityButtons from '@/components/views/community/CommunityButtons'
import CReplies from '@/components/views/community/CReplies'
import ReplyWrite from '@/components/views/community/ReplyWrite'

const useGlobalComponents = app => {
  app
  // app components
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
    .component('AppToggler', AppToggler)
    .component('AppTooltip', AppTooltip)
    .component('FileUploader', FileUploader)
    .component('WrapperDropdownOverlay', WrapperDropdownOverlay)

    // common components
    .component('ButtonCommunity', ButtonCommunity)
    .component('ModalHeader', ModalHeader)
    .component('OrderbookBybit', OrderbookBybit)
    .component('OrderbookUpbit', OrderbookUpbit)
    .component('PostEditor', PostEditor)
    .component('SCoin', SCoin)
    .component('TablePosts', TablePosts)
    .component('TradingView', TradingView)

    // community components
    .component('CommunityButtons', CommunityButtons)
    .component('CReplies', CReplies)
    .component('ReplyWrite', ReplyWrite)
}

export default useGlobalComponents