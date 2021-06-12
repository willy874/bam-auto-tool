module.exports = (str, reg) => {
  const checkType = s => {
    if (typeof s === 'string') {
      return new RegExp(s).test(str)
    }
    if (s instanceof RegExp) {
      return s.test(str)
    }
    if (typeof s === 'object') {
      return checkObject(s)
    }
    return s
  }
  const checkObject = s => {
    if (s.allow) {
      if (s.allow instanceof Array) {
        return s.allow.some(r => checkType(r))
      }
      return !checkType(s.allow)
    }
    if (s.exclude) {
      if (s.exclude instanceof Array) {
        return s.exclude.some(r => !checkType(r))
      }
      return !checkType(s.exclude)
    }
  }
  if (reg instanceof Array) {
    return reg.some(r => checkType(r))
  } else {
    return checkType(reg)
  }
}