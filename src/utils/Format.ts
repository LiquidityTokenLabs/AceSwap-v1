export const getShortAddress = (address: string) => {
  return address.substring(0, 6) + '...' + address.slice(-4)
}

export const convertHex2Dec = (hex: string) => {
  return parseInt(hex, 16)
}
export const convertDec2Hex = (dec: number) => {
  return `0x${dec.toString(16)}`
}

export const round = (data: number, digit: number) => {
  const pow = Math.pow(10, digit)

  return Math.round(data * pow) / pow
}
