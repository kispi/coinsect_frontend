// app components
import AdaptiveLayout from '@/components/app/AdaptiveLayout'
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
import FormControl from '@/components/app/FormControl'
import WrapperDropdownOverlay from '@/components/app/WrapperDropdownOverlay'

// common components
import InputInsta from '@/components/common/InputInsta'
import InputPhone from '@/components/common/InputPhone'
import ModalHeader from '@/components/modals/common-components/ModalHeader'
import RealTimeOrderbook from '@/components/common/RealTimeOrderbook'
import TradingView from '@/components/common/TradingView'

const useGlobalComponents = app => {
  app
  // app components
    .component('AdaptiveLayout', AdaptiveLayout)
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
    .component('FormControl', FormControl)
    .component('WrapperDropdownOverlay', WrapperDropdownOverlay)

    // common components
    .component('InputInsta', InputInsta)
    .component('InputPhone', InputPhone)
    .component('ModalHeader', ModalHeader)
    .component('RealTimeOrderbook', RealTimeOrderbook)
    .component('TradingView', TradingView)
}

export default useGlobalComponents