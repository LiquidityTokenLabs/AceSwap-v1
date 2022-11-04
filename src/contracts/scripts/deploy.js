const { ethers } = require('hardhat')

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  console.log('Account balance:', (await deployer.getBalance()).toString())

  SampleNFT = await ethers.getContractFactory('SampleNFT')
  sampleNFT = await SampleNFT.deploy(
    'SampleNFT',
    'SN',
    'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png'
  )
  console.log('SampleNFT Address:', sampleNFT.address)
  BondingCurve = await ethers.getContractFactory('LinearCurve')
  bondingCurve = await BondingCurve.deploy()
  console.log('LinearCurve Address:', bondingCurve.address)
  Router = await ethers.getContractFactory('Router')
  router = await Router.deploy()
  console.log('Router Address:', router.address)
  Factory721 = await ethers.getContractFactory('Factory721')
  factory721 = await Factory721.deploy(router.address, ethers.utils.parseEther('0.1'))
  console.log('Factory Address:', factory721.address)
  await router.connect(deployer).setCollectionApprove(sampleNFT.address, true)
  await router.connect(deployer).setBondingCurveApprove(bondingCurve.address, true)
  await router.connect(deployer).setFactory(factory721.address, true)

  poolInputValue = {
    collection: sampleNFT.address,
    bondingCurve: bondingCurve.address,
    spotPrice: spotPrice,
    delta: delta,
    divergence: divergence
  }

  pool721Address = await factory721.createPool(...Object.values(poolInputValue))
  pool721pend = await (await pool721Address).wait()
  const createPooled = pool721pend.events.find((event) => event.event === 'CreatePool')
  ;[pool721tast] = createPooled.args
  console.log('Pool Address:', pool721tast)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
