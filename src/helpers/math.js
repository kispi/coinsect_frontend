const math = {
  factorial: n => {
    let rval = 1
    for (let i = 2; i <= n; i++)
      rval = rval * i
    return rval
  },
  combination: (n, r) => {
    const f = math.factorial
    return f(n) / (f(n - r) * f(r))
  },
}

export default math