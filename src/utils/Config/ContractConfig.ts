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
  BondingCurveAddress: '0x01AB87b20FE729f51aa5aBf42F65480F8cdaD711',
  RouterAddress: '0xeeca9eBDb1C06E66E4f29e64f1fE315AD9B2176A',
  FactoryAddress: '0x4B9D4F36c381532a1CF7c67E99D5C3784428a57b',
  Pool721Address: '0x84fD97b59b98dAf98e2A03c9e006a69996b543dF',
  TokenAddress: '0x31E4413c54AD44eca690D8234AEE8e883b309268',
  ProtocolAddress: '0xDEBf97515Df321551326FB4c858F5E36D7073AF7',
}
