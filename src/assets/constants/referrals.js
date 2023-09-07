export const referrals = {
  bybit: {
    promotion: '수수료 <b>20%</b> 할인\n(지정가: 0.02% / 시장가 0.044%)',
    travelRule: ['upbit', 'bithumb', 'coinone', 'korbit'],
    benefits: ['입금액 / 거래량에 따라 최대 30,000 USDT 보너스'],
    link: 'https://partner.bybit.com/b/coinsect',
  },
  bitget: {
    promotion: '수수료 <b>50%</b> 할인\n(지정가: 0.02% / 시장가 0.04%)',
    travelRule: ['upbit', 'bithumb', 'coinone'],
    benefits: [],
    link: 'https://partner.bitget.com/bg/0U5130',
  },
  bingx: {
    promotion: '수수료 <b>45%</b> 페이백\n(지정가 0.011% / 시장가 0.0275%)',
    travelRule: ['bithumb', 'coinone'],
    benefits: ['입금액 / 거래량에 따라 최대 5,000 USDT 보너스'],
    link: 'https://bingx.com/en-us/partner/coinsect',
  },
}

Object.keys(referrals).forEach(exchangeKey => referrals[exchangeKey].key = exchangeKey)

export default referrals