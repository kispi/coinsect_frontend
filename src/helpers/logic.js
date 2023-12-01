import { store } from '@/store'
import helpers from '.'

const logic = {
  generateUUIDV4: () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return `${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`
  },
  shuffle: arr => {
    let j, x, i
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = arr[i]
      arr[i] = arr[j]
      arr[j] = x
    }
    return arr
  },
  retrieveUrlFromString: url => ((url || '').match(helpers.dom.regex.url) || [])[0],
  retrieveImagesFromHTML: html => {
    const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/g
    const images = []
    let img
    while ((img = imgRegex.exec(html))) images.push(img[1])

    return images
  },
  includesChosung: (partial, whole) => {
    const d = Hangul.disassemble
    if (d(partial, true).length !== d(partial).length) return

    if (!partial || !whole) return

    const arr = {
      partial: d(partial, true).map(group => group[0]),
      whole: d(whole, true).map(group => group[0]),
    }

    const foundIndices = arr.partial.map(val => arr.whole.indexOf(val))
    if (foundIndices.includes(-1)) return

    const orderedIndices = JSON.parse(JSON.stringify(foundIndices)).sort()
    return JSON.stringify(foundIndices) === JSON.stringify(orderedIndices)
  },
  pricePrediction: {
    dateRange: pricePrediction => {
      const d = date => helpers.dayjs(date).format('YYYY-MM-DD')
      if (pricePrediction.timeFrom && pricePrediction.timeTo) return `${d(pricePrediction.timeFrom)} ~ ${d(pricePrediction.timeTo)}`
      if (pricePrediction.timeFrom) return `${d(pricePrediction.timeFrom)} ~`
      if (pricePrediction.timeTo) return `~ ${d(pricePrediction.timeTo)}`
    },
    priceRange: pricePrediction => {
      const p = price => helpers.number.pretty.price({ price, noConversion: true})
      if (parseFloat(pricePrediction.priceMin) && parseFloat(pricePrediction.priceMax)) return `$${p(pricePrediction.priceMin)} ~ $${p(pricePrediction.priceMax)}`
      if (parseFloat(pricePrediction.priceMin)) return `$${p(pricePrediction.priceMin)} ~`
      if (parseFloat(pricePrediction.priceMax)) return `~ $${p(pricePrediction.priceMax)}`
    },
    summary: pricePrediction => {
      const d = date => helpers.dayjs(date)
      const diff = d(pricePrediction.timeTo || pricePrediction.timeFrom).startOf('day').diff(d().startOf('day'), 'days')
      if (diff < 0) return '만료'

      const l = logic.pricePrediction.outlook(pricePrediction)
      return `${diff}일 안에 <span class="${l === 'bullish' ? 'c-price-up-bybit' : l === 'bearish' ? 'c-price-down-bybit' : null}">$${helpers.number.pretty.price({
        price: parseFloat(pricePrediction.priceMin || pricePrediction.priceMax),
        noConversion: true,
      })}</span> 도달`
    },
    outlook: pricePrediction => {
      if (parseFloat(pricePrediction.priceMin || pricePrediction.priceMax) > parseFloat(pricePrediction.priceSnapshot)) return 'bullish'
      if (parseFloat(pricePrediction.priceMax || pricePrediction.priceMin) < parseFloat(pricePrediction.priceSnapshot)) return 'bearish'
      return 'sideways'
    },
  },
  writing: {
    isMine: writing => {
      if (!store.getters.me || !(writing || {}).user) return
  
      return (writing.user || {}).id === (store.getters.me || {}).id
    },
    nickname: writing => {
      return (((writing || {}).user || {}).profile || {}).nickname || (writing || {}).nickname
    },
    canModify: writing => {
      if (!writing || writing.deletedAt) return
  
      // 게시글 또는 댓글의 작성자가 나이거나, 둘 다 undefined인 경우.
      return !writing.user || helpers.logic.writing.isMine(writing)
    },
  },
  mustToken: existingTokens => {
    const o = {}
    if (existingTokens) existingTokens.forEach(t => o[t] = true)
  
    let nonExistNewToken = ''
    for (let i = 0; i < 100; i++) {
      let token = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      if (o[token]) continue
  
      nonExistNewToken = token
      break
    }

    return nonExistNewToken
  },
  onPasteClipboardImage: async (pasteEvent, resolve) => {
    const items = (pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData).items
    const img = items[0]
    if (!img.type.includes('image')) return

    const file = img.getAsFile()
    const reader = new FileReader()
    reader.onload = onloadEvent => {
      pasteEvent.target.blur()
      helpers.modal.custom({
        component: 'ModalUploadImage',
        options: {
          file,
          src: onloadEvent.target.result,
        },
      }).then(resolve)
    }

    const target = file.size > 1048576 ? await helpers.logic.resizeImage({ file, width: 1920 }) : file
    reader.readAsDataURL(target)
  },
  hexToRgba: (hex, alpha = 1) => {
    if (!hex) return

    const [r, g, b] = (hex.match(/\w\w/g) || []).map(x => parseInt(x, 16))
    return `rgba(${r},${g},${b},${alpha})`
  },
  acceptableFileSize: (file, maxFileSize = 5) => {
    const fileSizeAsMB = file.size / 1048576
    if (fileSizeAsMB > maxFileSize) {
      toast.error(`${maxFileSize}MB 이하 용량의 이미지를 사용해주세요`)
      return
    }

    return true
  },
  dataURLToBlob: async dataUrl => {
    const result = await fetch(dataUrl)
    return result.blob()
  },
  // https://www.npmjs.com/package/image-resize
  resizeImage: async ({
    file,
    width,
    format,
    quality,
    reSample,
  }) => {
    if (typeof ImageResize === 'undefined') return file

    const o = new ImageResize({
      format,
      width,
      quality,
      reSample,
    })

    try {
      const dataUrl = await o.play(file)
      return new File([await helpers.logic.dataURLToBlob(dataUrl)], file.name, { type: 'image/jpeg' })
    } catch (e) {
      return file
    }
  },
  crypto: {
    hash: {
      sha256: async message => {
        if (typeof crypto === 'undefined') return

        const msgUint8 = new TextEncoder().encode(message)
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        return hashHex
      },
    },
    decryptAPIResponse: async encrypted => {
      const decrypted = encrypted
        .split('')
        .map(c => String.fromCharCode(c.charCodeAt(0) + 5))
        .join('')

      try {
        return JSON.parse(decrypted)
      } catch (error) {
        console.error('Decryption error:', error)
      }
    },
  },
}

export default logic