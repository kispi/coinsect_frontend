const f = v => v < 0 ? 0 : v

const tax = y => {
  // y는 세전이 아닌 과세표준임 (소득공제된 금액)
  const r = [12, 46, 88, 150, 300, 500, 1000].map(v => v * Math.pow(10, 6))
  if (y <= r[0]) return y * 0.06
  if (y <= r[1]) return y * 0.15 - 1080000
  if (y <= r[2]) return y * 0.24 - 5220000
  if (y <= r[3]) return y * 0.35 - 14900000
  if (y <= r[4]) return y * 0.38 - 19400000
  if (y <= r[5]) return y * 0.4 - 25400000
  if (y <= r[6]) return y * 0.42 - 35400000
  return y * 0.45 - 65400000
}

const deducible = (y, numFamily, bonus) => {
  let income = 0
  const arr1 = [5, 15, 45, 100].map(v => v * Math.pow(10, 6))
  if (y <= arr1[0]) income = y * 0.7
  else if (y <= arr1[1]) income = 3500000 + (y - arr1[0]) * 0.4
  else if (y <= arr1[2]) income = 7500000 + (y - arr1[1]) * 0.15
  else if (y <= arr1[3]) income = 12000000 + (y - arr1[2]) * 0.05
  else income = 14750000 + (y - arr1[3]) * 0.02

  let tax = 0
  const arr2 = [33, 70].map(v => v * Math.pow(10, 6))
  if (y < 740000) tax = y
  else if (y <= arr2[0]) tax = 740000
  else if (y <= arr2[1]) tax = Math.max(660000, 740000 - (y - arr2[0]) * 0.008)
  else tax = Math.max(500000, 660000 - (y - arr2[1]) * 0.5)

  let family = y < 1500000 ? y : 1500000 * numFamily

  let nonTax = y < bonus ? y : bonus

  return { income, tax, family, nonTax }
}

const taxedSalary = ({
  preTax = 22000000, // 세전연봉
  numFamily = 1,     // 인적공제
  nonTax = 1200000,  // 비과세 default: 월 10만원
}) => {
  let pension = f((preTax - nonTax) * 0.045) // 국민연금

  if (pension > 235800 * 12) pension = 235800 * 12 // 국민연금 상한

  const health = f((preTax - nonTax) * 0.03495) // 건강보험

  const care = f(health * 0.1227) // 장기요양

  const hire = f((preTax - nonTax) * 0.008) // 고용보험

  const deduction = deducible(preTax, numFamily, nonTax)

  const taxOn = f(preTax - pension - health - care - hire - deduction.income - deduction.tax - deduction.family - deduction.nonTax) // 과세표준

  const incomeTax = tax(taxOn) // 소득세

  const incomeTaxLocal = incomeTax * 0.1

  const totalTax = pension + health + care + hire + incomeTax + incomeTaxLocal

  const afterTax = preTax - totalTax

  return {
    pension,
    health,
    care,
    hire,
    taxDeduction: deduction.tax,
    incomeDeduction: deduction.income,
    familyDeduction: deduction.family,
    taxOn,
    nonTax,
    incomeTax,
    incomeTaxLocal,
    totalTax,
    afterTax,
  }
}


export default taxedSalary