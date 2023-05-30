import helpers from '@/helpers/index'
import createBus from '@/helpers/bus'
import { $http, $httpNoAuth } from '@/modules/axios'

export default {
  install: (app) => {
    app.config.globalProperties.$helpers = helpers

    app.config.globalProperties.$translate = helpers.translate

    app.config.globalProperties.$http = $http

    app.config.globalProperties.$httpNoAuth = $httpNoAuth

    app.config.globalProperties.$tooltip = helpers.tooltip

    app.config.globalProperties.$modal = helpers.modal

    app.config.globalProperties.$toast = helpers.toast

    app.config.globalProperties.$animate = helpers.animate

    app.config.globalProperties.$bus = createBus()
  },
}