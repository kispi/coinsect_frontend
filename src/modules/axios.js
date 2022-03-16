import axios from 'axios'

axios.interceptors.response.use(
  res => res.data,
  err => {
    if (!err.response) {
      throw err
    }

    throw err.response
  },
)

axios.defaults.baseURL = `${process.env.VUE_APP_API_DOMAIN}`

const setRequestHeader = header => {
  if (header.token) axios.defaults.headers['Authorization'] = `Bearer ${header.token}`

  Object.keys(header).forEach(key => {
    if (!header[key]) return

    axios.defaults.headers[key] = header[key]
  })
}

const clearRequestHeader = () => Object.keys(axios.defaults.headers).forEach(key => delete axios.defaults.headers[key])

export default {
  setRequestHeader,
  clearRequestHeader,
}