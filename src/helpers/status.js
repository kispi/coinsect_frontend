const statusGroups = {
  success: {
    items: ['delivered', 'shipped', 'in_box', 'collected', 'scp_in_stock', 'scp_short'],
    background: 'success',
  },
  progress: {
    items: ['in_transit', 'under_qc'],
    background: 'status-blue',
  },
  subProgress: {
    items: ['refund_requested', 'processing', 'replacing', 'printing'],
    background: 'status-purple',
  },
  ready: {
    items: ['on_deck', 'requesting', 'collecting', 'scp_in_progress'],
    background: 'status-orange',
  },
  info: {
    items: ['stock_confirmed'],
    background: 'info',
  },
  warning: {
    items: [],
    background: 'warning',
  },
  danger: {
    items: ['delivery_failed', 'refunded', 'scp_out_of_stock', 'failed'],
    background: 'danger',
  },
  pending: {
    items: ['replaced', 'scp_requested'],
    background: 'black',
  },
  muted: {
    items: ['ex_delayed', 'scp_cancelled'],
    background: 'status-gray',
  },
  exception: {
    items: ['ex_waiting_for_payment'],
    background: 'status-white',
  },
  deepWarning: {
    items: ['ex_out_of_stock'],
    background: 'status-brown',
  },
  progressImportant: {
    items: ['completed'],
    background: 'outline-success',
  },
}

Object.keys(statusGroups).forEach(key => {
  if (key === 'exception') statusGroups[key].text = 'black'
  else if (key === 'progressImportant') statusGroups[key].text = 'success'
  else statusGroups[key].text = 'white'  
})

export default {
  asClasses: status => {
    const found = Object.keys(statusGroups).find(key => statusGroups[key].items.includes(status))
    if (!found) return `bg-black c-white`

    return `bg-${statusGroups[found].background} c-${statusGroups[found].text}`
  },
}