import helpers from '@/helpers'

const onImage = (el, bind, backgroundSize) => {
  const val = bind.value || ''
  const attrUrl = `url('${(val.startsWith('http') || val.startsWith('blob')) ? val : helpers.withCdn(val)}')`

  el.setAttribute('style', `
    background-image: ${attrUrl}, url('${helpers.withCdn('no_image.svg', 'images/small')}');
    background-repeat: no-repeat;
    background-size: ${backgroundSize};
  `)
}

export const imgCover = {
  beforeMount: (el, bind) => onImage(el, bind, 'cover'),
  updated: (el, bind) => onImage(el, bind, 'cover'),
}

export const imgContain = {
  beforeMount: (el, bind) => onImage(el, bind, 'contain'),
  updated: (el, bind) => onImage(el, bind, 'contain'),
}