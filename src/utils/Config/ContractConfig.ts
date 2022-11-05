export type ContractConfig = {
  ChainName: string
  BondingCurveAddress: string
  RouterAddress: string
  FactoryAddress: string
  TokenAddress: string
  Pool721Address: string
  ProtocolAddress: string
}

export const GoerliConfig: ContractConfig = {
  ChainName: 'goerli',
  BondingCurveAddress: '0x36Edc0F51A6629F12842d1911742f10235453Ea9',
  RouterAddress: '0x0000ec4F61C8Db0B46F7913c7c749E0821B4cf13',
  FactoryAddress: '0x0102af09E0D42de20D64F617f57FdA58c391fCef',
  Pool721Address: '0x41c96e1FC0C358ecCF4E1dE98B3f900347deD456',
  TokenAddress: '0x0d2EFDb26D185442F39A058bE87724600E1F7708',
  ProtocolAddress: '0xDEBf97515Df321551326FB4c858F5E36D7073AF7',
}
