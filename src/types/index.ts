export type ModalOptions = {
  title?: string
  body?: string
  class?: string
  buttons?: { text: string; class?: string }[]
  useMultiOpen?: boolean
  noHeader?: boolean
  [key: string]: any
}

export type TooltipOptions = {
  id: any
  text: any
  showAbove?: any
  below?: any
  useCloser?: any
  light?: any
  width?: any
  overridenStyle?: any
  handler?: () => void
}

export type AppDropdownItem = {
  key: string
  text?: string
  html?: string
  icon?: string
  $$selected?: boolean
}

export type DefaultServerError = {
  status: number
  data: { message: string }
}
