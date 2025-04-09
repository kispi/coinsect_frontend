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
  id: string
  text: string
  showAbove?: HTMLElement | null
  below?: boolean
  useCloser?: boolean
  light?: boolean
  width?: number
  handler?: () => void
}

export type ToastOptions = {
  html: string | null
  type?: string
  show?: boolean
  duration?: number
  action?: {
    handler: Function | null
    label: string | null
  }
}

export type SnackbarOptions = {
  id?: string
  html: string
  class?: string
  duration?: number
}

export type MetaTag = {
  id: string
  rel?: string
  href?: string
  property?: string
  name?: string
  content?: string
  tag?: string
}

export type AppDropdownItem = {
  key: string
  text?: string
  html?: string
  icon?: string
  $$selected?: boolean
}

export type WhaleAlertSymbol = {
  symbol: string
  $$selected: boolean
  isStable: boolean
}

export type DefaultServerError = {
  status: number
  data: {
    message: string
    extra?: {
      bannedUser: BannedUser
    }
  }
}

export type PortfolioItem = {
  market: string
  amount: string
  averagePurchasePrice: number
  $$unrealized?: number
  $$worth?: number
  $$roi?: number
  $$unrealizedAsBTC?: number
}

export type AccountStats = {
  numMessages: number
  numMessagesReplyTo: number
  numPosts: number
  numReplies: number
  numRepliesReplyTo: number
}

export type Image = {
  createdAt: string
  deletedAt: string
  description: string
  id: number
  key: string
  type: string
  updatedAt: string
}

export type Profile = {
  image: string
  nickname: string
  sentiment?: {
    expireAt: string
    type: 'long' | 'short'
  }
}

export type User = {
  id?: number
  profile?: Profile
  jwt?: string
  token: string
}

export type BannedUser = {
  id: number
  reason: string
  until: string
  user: User
}

export type Blockchain = {
  createdAt: string
  deletedAt: string
  description: string
  exploreUrl: string
  icon: string
  id: number
  name: string
  symbol: string
  updatedAt: string
}

export type Wallet = {
  address: string
  balance: string
  blockchain: Blockchain
  createdAt: string
  deletedAt: string
  updatedAt: string
  description: string
  id: number
  memo: string
}

export type UpbitNews = {
  category: string
  coin_report_download_link: string
  coin_report_logo_url: string
  company: string
  content: string
  created_at: string
  is_best?: boolean
  id: number
  thumbnail: string
  title: string
  url: string
}

export type RealTimePosition = {
  $$unrealized: number
  $$value: number
  contract: string
  editable: boolean
  entryPrice: number
  id: string
  image: string
  lastUpdate: string
  link: string
  markPrice: number
  name: string
  onAir: boolean
  size: number
  tracking: boolean
}

export type Person = {
  bio: string
  createdAt: string
  deletedAt: string
  description: string
  id: number
  images: Image[]
  name: string
  sharingKey: string
  updatedAt: string

  $$description?: string
  $$bio?: string
}

export type BitmexLeaderboardItem = {
  dailyChange: number
  name: string
  profit: number
  rank: number
  side: string
  timestamp: string
  weeklyChange: number
}

export type WhaleAlert = {
  amount: string
  amountUsd: string
  blockchain: string
  fromAddress: string
  fromOwner: string
  fromOwnerType: string
  hash: string
  symbol: string
  timestamp: number
  toAddress: string
  toOwner: string
  toOwnerType: string
  transactionCount: number
  transactionType: string
}

export type Reaction = {
  ip: string
  nickname: string
  type: string
  userId?: number
}

export type Message = {
  id: number
  meta: any
  numConnections: number
  reactions: Reaction[]
  stats: {
    numBears: number
    numBulls: number
    numConnections: number
  }
  text: string
  ts: string
  type: string
  user: User
  timestamp: number

  $$hide?: boolean
}

export type Notification = {
  active: boolean
  createdAt: string
  deletedAt: string
  id: number
  link: string
  text: string
  type: string
  updatedAt: string
}

export type Board = {
  createdAt: string
  deletedAt: string
  description: string
  id: number
  title: string
  type: string
  updatedAt: string

  $$color?: string
}

export type Reply = {
  content: string
  createdAt: string
  deletedAt: string
  id: number
  lastEdit: string
  nickname: string
  parent: Reply
  replies: Reply[]
  postId: number
  summary: any
  updatedAt: string
  user: User
  userId: number

  $$showReply?: boolean
}

export type Post = {
  board: Board
  boardId: number
  content: string
  createdAt: string
  deletedAt: string
  id: number
  lastEdit: string
  nickname: string
  postType: string
  replies: Reply[]
  sharingKey: string
  summary: {
    numReplies: number
    reactions: Record<string, { activated: boolean; count: number }>
  }
  tags: string
  title: string
  updatedAt: string
  user: User
  userId: number
  views: number

  $$originalPassword?: string
  $$images?: string[]
  $$thumbnail?: string
}