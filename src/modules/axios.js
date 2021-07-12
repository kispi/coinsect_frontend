import axios from 'axios'

const useGtmEventsResponse = response => {
  if (!response.headers['gtm-events']) return

  try {
    const gtmEvents = JSON.parse(response.headers['gtm-events'])
    gtmEvents.forEach(gtmEvent => window.dataLayer.push(gtmEvent))
  } catch (e) {}
}

axios.interceptors.response.use(
  res => {
    useGtmEventsResponse(res)
    return res.data
  },
  err => {
    if (!err.response) {
      throw err
    }

    throw err.response
  }
)

axios.defaults.baseURL = `${process.env.VUE_APP_API_DOMAIN}/api/v1`

const setRequestHeader = header => {
  if (header.token) axios.defaults.headers['Authorization'] = `Bearer ${header.token}`

  const keys = ['currency', 'country', 'marketing-referrer', 'vue-router-referrer', 'client-session-id']
  keys.forEach(key => {
    if (!header[key]) return

    axios.defaults.headers[key] = header[key]
  })
}

const clearRequestHeader = () => ['Authorization', 'currency', 'country'].forEach(key => delete axios.defaults.headers[key])

export default {
  setRequestHeader,
  clearRequestHeader,
  defaults: axios.defaults,
}