const { expect } = require('chai')
const { ethers } = require('hardhat')

let spotPrice = ethers.utils.parseEther('0.01')
let delta = ethers.utils.parseEther('0.001')
let spread = ethers.utils.parseEther('0.2')
let protocolFeeRatio = ethers.utils.parseEther('0.2')

describe('プール別テスト(SingleERC20OPool)', function () {
  before('コントラクトデプロイ&ミント', async () => {
    ;[owner, staker, staker2, swapperFTforNFT, swapperNFTforFT, supporter1, newRouter] = await ethers.getSigners()
    SampleNFT = await ethers.getContractFactory('SampleNFT')
    sampleNFT = await SampleNFT.deploy('SampleNFT', 'SN', '')
    SampleFT = await ethers.getContractFactory('SampleFT')
    sampleFT = await SampleFT.deploy('SampleNFT', 'SN')
    BondingCurve = await ethers.getContractFactory('LinearCurve')
    bondingCurve = await BondingCurve.deploy()
    Router = await ethers.getContractFactory('Router')
    router = await Router.deploy()
    FactorySingleERC20NOPool = await ethers.getContractFactory('FactorySingleERC20NOPool')
    factorySingleERC20NOPool = await FactorySingleERC20NOPool.deploy(router.address, protocolFeeRatio)
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker2).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperFTforNFT).mint()
    //10
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
  })
  describe('Routerの初期設定', () => {
    it('SET:ボンディングカーブの登録', async () => {
      await router.setBondingCurveApprove(bondingCurve.address, true)
      expect(await router.getIsBondingCurveApprove(bondingCurve.address)).to.true
    })
    // it("GET:ボンディングカーブリストに追加される", async () => {
    //   bondingCurveList = await router.getBondingCurveList();
    //   expect(bondingCurveList[0]).to.equal(bondingCurve.address);
    // });
    it('SET:コレクションの登録', async () => {
      await router.setCollectionApprove(sampleNFT.address, true)
      expect(await router.getIsCollectionApprove(sampleNFT.address)).to.true
    })
    it('SET:Factoryの登録', async () => {
      await router.setFactoryApprove(factorySingleERC20NOPool.address, true)
      expect(await router.getIsFactoryApprove(factorySingleERC20NOPool.address)).to.true
    })
    it('SET:ペイメントトークンの登録', async () => {
      await router.setPaymentTokenApprove(sampleFT.address, true)
      expect(await router.getIsPaymentTokenApprove(sampleFT.address)).to.true
    })
    // it("GET:ペイメントトークンリストに追加される", async () => {
    //   paymentTokenList = await router.getPaymentTokenList();
    //   expect(paymentTokenList[0]).to.equal(sampleFT.address);
    // });
  })

  describe('ERC20の確認', () => {
    it('生成', async () => {
      await sampleFT.connect(staker).mint(ethers.utils.parseEther('1'))
      await sampleFT.connect(staker2).mint(ethers.utils.parseEther('1'))
      await sampleFT.connect(swapperFTforNFT).mint(ethers.utils.parseEther('1'))
      await sampleFT.connect(swapperNFTforFT).mint(ethers.utils.parseEther('1'))
      expect(await sampleFT.connect(staker).balanceOf(staker.address)).to.equal(ethers.utils.parseEther('1'))
    })
  })

  describe('ファクトリーによるプールの作成', () => {
    it('MAIN:Factory721によるプールの作成', async function () {
      pool721Address = await factorySingleERC20NOPool
        .connect(staker)
        .createPool(sampleNFT.address, bondingCurve.address, spotPrice, delta, spread, sampleFT.address)
      pool721pend = await (await pool721Address).wait()
      await expect(pool721Address).to.emit(factorySingleERC20NOPool, 'CreatePool')
    })
    it('GET:作成したプールのアドレスを確認', async function () {
      const createPooled = pool721pend.events.find((event) => event.event === 'CreatePool')
      ;[pool721tast] = createPooled.args
      expect(pool721tast).to.not.be.null
      // (pool721tast)
    })
    it('GET:プールのインスタンス化', async function () {
      const Pool721 = await ethers.getContractFactory('SingleERC20NOPool')
      singleERC20NOPool = await new ethers.Contract(
        pool721tast,
        Pool721.interface.format(),
        factorySingleERC20NOPool.signer
      )
    })
  })

  describe('プールの初期状態の確認', () => {
    it('GET:ボンディングカーブは設定したアドレスに等しい', async function () {
      bondingCurveAddress = await singleERC20NOPool.bondingCurve()
      expect(bondingCurveAddress).to.equal(bondingCurve.address)
    })
    it('GET:コレクションは設定したアドレスに等しい', async function () {
      collectionAddress = await singleERC20NOPool.collection()
      expect(collectionAddress).to.equal(sampleNFT.address)
    })
    it('GET:Routerは設定したアドレスに等しい', async function () {
      routerAddress = await singleERC20NOPool.router()
      expect(routerAddress).to.equal(router.address)
    })
    it('GET:ProtocolFeeRatioは設定した値に等しい', async function () {
      tmpProtocolFeeRatio = await singleERC20NOPool.protocolFeeRatio()
      expect(tmpProtocolFeeRatio).to.equal(protocolFeeRatio)
    })
    it('GET:buyEventNumは設定した値に等しい', async function () {
      buyEventNum = await singleERC20NOPool.buyEventNum()
      expect(buyEventNum).to.equal(0)
    })
    it('GET:sellEventNumは設定した値に等しい', async function () {
      sellEventNum = await singleERC20NOPool.sellEventNum()
      expect(sellEventNum).to.equal(0)
    })
    it('GET:stakeNFTpriceは設定した値に等しい', async function () {
      stakeNFTprice = await singleERC20NOPool.stakeNFTprice()
      expect(stakeNFTprice).to.equal(spotPrice)
    })
    it('GET:stakeFTpriceは設定した値に等しい', async function () {
      stakeFTprice = await singleERC20NOPool.stakeFTprice()
      expect(stakeFTprice).to.equal(spotPrice)
    })
    it('GET:poolInfoは設定した値に等しい', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(spotPrice)
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(delta)
      expect(poolInfo.spread).to.equal(spread)
    })
    it('GET:paymentAddressは設定した値に等しい', async function () {
      paymentAddress = await singleERC20NOPool.paymentToken()
      expect(paymentAddress).to.equal(sampleFT.address)
    })
    it('GET:他のユーザーはステークできる(isOtherStakeはtrue)', async function () {
      isOtherStake = await singleERC20NOPool.isOtherStake()
      expect(isOtherStake).to.not.true
    })
    it('GET:ペアでステーキングする必要はない(isPairがfalse)', async function () {
      isPair = await singleERC20NOPool.isPair()
      expect(isPair).to.not.true
    })
  })

  let spotPrice1 = ethers.utils.parseEther('0.01')
  describe('ボンディングカーブの計算が正しいか検証', () => {
    it('GET:適切な計算がされる', async () => {
      totalFee = await singleERC20NOPool.getCalcSellInfo(4, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0.024'))
    })
    it('GET:適切な計算がされる', async () => {
      totalFee = await singleERC20NOPool.getCalcBuyInfo(4, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0.046'))
    })
    it('GET:個数が多すぎて元の数を割る場合は0に近い形で調整される', async () => {
      totalFee = await singleERC20NOPool.getCalcSellInfo(12, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0.0352'))
    })
    it('GET:個数が0だとエラーが出て全て0になる', async () => {
      totalFee = await singleERC20NOPool.getCalcSellInfo(0, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0'))
    })
    it('GET:個数が0だとエラーが出て全て0になる', async () => {
      totalFee = await singleERC20NOPool.getCalcBuyInfo(0, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0'))
    })
    let maxSpotPrice = ethers.utils.parseEther('1000000000000000000')
    it('GET:過剰に大きな数を入れるとエラーが出て全て0になる', async () => {
      totalFee = await singleERC20NOPool.getCalcBuyInfo(0, maxSpotPrice)
      expect(totalFee).to.equal(ethers.utils.parseEther('0'))
    })
    it('GET:ボンディングカーブによる流動性報酬の計算', async () => {
      totalFee = await bondingCurve.getFee(
        ethers.utils.parseEther('0.1'),
        ethers.utils.parseEther('0.2'),
        ethers.utils.parseEther('0.2')
      )
      expect(totalFee.lpFee).to.equal(ethers.utils.parseEther('0.016'))
      expect(totalFee.protocolFee).to.equal(ethers.utils.parseEther('0.004'))
    })
  })

  describe('NFTをステーキング → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.01
    //stakeNFTprice: 0.01
    it('GET:プールの初期状態の確認', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.01'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('GET:NFTが元の所有者であるstakerAになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(staker.address)
    })
    it('MAIN:NFTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(singleERC20NOPool.address, 1)
      expect(await router.connect(staker).stakeNFT(singleERC20NOPool.address, ['1'])).to.emit(router, 'StakeNFT')
    })
    it('GET:NFTが元の所有者であるstakerAになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(singleERC20NOPool.address)
    })
    it('GET:ステーキングされたことでBuyNumが増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.buyNum).to.equal(1)
    })
    it('GET:stakeNFTPriceは需要に合わせて増加する', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      expect(await router.connect(staker).withdrawNFT(singleERC20NOPool.address, ['1'])).to.emit(router, 'WithdrawNFT')
    })
    it('GET:ステーキングが解除されたのでstakeNFTpriceが下がる', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:NFTが元の所有者であるstakerAになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(staker.address)
    })
    it('GET:[状態確認]poolInfoの状態は想定通りである', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.01'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
  })

  describe('NFTをステーキング → FTでスワップ → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.01
    //stakeNFTprice: 0.01
    it('GET:stakeNFTprice', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await singleERC20NOPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:[状態確認]poolInfoの状態は想定通りである', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.01'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('GET:NFTが元の所有者であるstakerNFTになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(staker.address)
    })
    it('MAIN:NFTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(singleERC20NOPool.address, 1)
      expect(await router.connect(staker).stakeNFT(singleERC20NOPool.address, ['1'])).to.emit(router, 'StakeNFT')
    })
    it('GET:NFTがステーキングされたことでプールになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(singleERC20NOPool.address)
    })
    it('GET:ステーキングによってbuyNumが増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.buyNum).to.equal(1)
    })

    it('GET:approve', async () => {
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.01'))
    })
    it('MAIN:FTからNFTにスワップをするとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(swapperFTforNFT).balanceOf(swapperFTforNFT.address)
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(singleERC20NOPool.address, ['1'], supporter1.address, {})
      ).to.emit(router, 'SwapFTforNFT')
      let afterBalance = await sampleFT.connect(swapperFTforNFT).balanceOf(swapperFTforNFT.address)
      expect(beforBalance.sub(afterBalance)).to.equal(ethers.utils.parseEther('0.01'))
      afterBalance.sub(beforBalance).toString() + ':swapのために消費'
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(swapperFTforNFT.address)
    })
    it('GET:spotPricaが増加してbuyNumが減り、sellNumが増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(1)
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(await router.connect(staker).withdrawNFT(singleERC20NOPool.address, [])).to.emit(router, 'WithdrawNFT')
      let afterBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':受け取り')
    })
    it('GET:流動性解除によりsellNumが減る', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
    })
  })

  describe('NFTをステーキング → FTからNFTにスワップ → NFTからFTにスワップ → 流動性解除', () => {
    //spotPrice: 0.011
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.011
    //stakeNFTprice: 0.011
    it('GET:stakeNFTprice', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await singleERC20NOPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:[状態確認]poolInfo', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(2)).to.equal(staker.address)
    })
    it('MAIN:NFTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(singleERC20NOPool.address, 2)
      expect(await router.connect(staker).stakeNFT(singleERC20NOPool.address, ['2'])).to.emit(router, 'StakeNFT')
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(2)).to.equal(singleERC20NOPool.address)
    })
    it('GET:[状態確認]buyNumが1増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(1)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:FTからNFTにスワップをするとEventが発行される', async () => {
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.011'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(singleERC20NOPool.address, ['2'], supporter1.address, {
          value: ethers.utils.parseEther('0.011')
        })
      ).to.emit(router, 'SwapFTforNFT')
    })
    it('GET:[状態確認]buyNumが1減って、sellNumが1増える、spotPriceが増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.012'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(1)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:NFTからFTにスワップするとEventが発行される', async () => {
      await sampleNFT.connect(swapperNFTforFT).approve(singleERC20NOPool.address, 3)
      expect(
        await router
          .connect(swapperNFTforFT)
          .swapNFTforFT(singleERC20NOPool.address, ['3'], ethers.utils.parseEther('0.0088'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('GET:[状態確認]sellNumが1減って、buyNumが1増える、spotPriceが減る', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(1)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:NFTの流動性を解除すると流動性報酬が入り残高が増える', async () => {
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(await router.connect(staker).withdrawNFT(singleERC20NOPool.address, ['3'])).to.emit(router, 'WithdrawNFT')
      let afterBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':LP受け取り')
    })
    it('GET:[状態確認]buyNumが1減る', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('SET:サポーターを追加', async () => {
      await router.connect(owner).setSupporterApprove(supporter1.address, true)
      expect(await router.getIsSupporterApprove(supporter1.address)).to.true
    })
    //ガス代によっては0になるのでほぼ増加してるはず
    it('MAIN:サポーターFeeが適切にもらえる', async () => {
      let beforBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(paymentAddress)
      let afterBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':サポーター受け取り')
    })
    it('MAIN:ProtocolFeeが適切にもらえる', async () => {
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)

      await router.connect(owner).withdrawProtocolFee(paymentAddress)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
    })
  })
  describe('NFTをステーキング → FTからNFTにスワップ → NFTからFTにスワップ → 流動性解除', () => {
    //spotPrice: 0.011
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.011
    //stakeNFTprice: 0.011
    it('GET:stakeNFTprice', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await singleERC20NOPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:[状態確認]poolInfo', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('NFTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(singleERC20NOPool.address, 4)
      expect(await router.connect(staker).stakeNFT(singleERC20NOPool.address, ['4'])).to.emit(router, 'StakeNFT')
    })
    it('GET:[状態確認]buyNumが1増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(1)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:FTからNFTにスワップをするとEventが発行される', async () => {
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.011'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(singleERC20NOPool.address, ['4'], supporter1.address)
      ).to.emit(router, 'SwapFTforNFT')
    })
    it('GET:[状態確認]buyNumが1減って、sellNumが1増える、spotPriceが増える', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.012'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(1)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:NFTからFTにスワップするとEventが発行される', async () => {
      await sampleNFT.connect(swapperNFTforFT).approve(singleERC20NOPool.address, 5)
      expect(
        await router
          .connect(swapperNFTforFT)
          .swapNFTforFT(singleERC20NOPool.address, ['5'], ethers.utils.parseEther('0.0088'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('GET:[状態確認]sellNumが1減って、buyNumが1増える、spotPriceが減る', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(1)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    //0.011がspotPriceのため売買における利益は0.0022になる
    //さらにここから8割が流動性提供者に行くため、0.00176が流動性報酬
    //プロトコル手数料は0.00033
    //サポーター手数料は0.00011
    it('MAIN:NFTの流動性を解除すると流動性報酬が入り残高が増える', async () => {
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(await router.connect(staker).withdrawNFT(singleERC20NOPool.address, ['5'])).to.emit(router, 'WithdrawNFT')
      let afterBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
    })
    it('GET:[状態確認]buyNumが1減る', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    //ガス代によっては0になるのでほぼ増加してるはず
    it('MAIN:サポーターFeeが適切にもらえる', async () => {
      let beforBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(paymentAddress)
      let afterBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':サポーター受け取り')
    })
    it('MAIN:ProtocolFeeが適切にもらえる', async () => {
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)

      await router.connect(owner).withdrawProtocolFee(paymentAddress)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
    })
  })

  describe('プールを作成したユーザー以外はステーキングできない', () => {
    it('NFTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker2).approve(singleERC20NOPool.address, 6)
      await expect(router.connect(staker2).stakeNFT(singleERC20NOPool.address, ['6'])).to.be.revertedWith('Not Owner')
    })
  })

  describe('FTをステーキング → 流動性解除', () => {
    //spotPrice: 0.011
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.011
    //stakeNFTprice: 0.011
    it('GET:stakeNFTprice', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await singleERC20NOPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:[状態確認]プールの初期確認', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:FTをステーキングするとEventが発行される', async () => {
      await sampleFT.connect(staker).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.0080'))
      expect(await router.connect(staker).stakeFT(singleERC20NOPool.address, 1)).to.emit(router, 'StakeFT')
    })
    it('GET:sellNumを増やす', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(1)
    })
    it('GET:[状態確認]userInfo', async () => {
      userInfo = await singleERC20NOPool.getUserInfo()
      expect(userInfo.initBuyNum).to.equal(0)
      expect(userInfo.initSellNum).to.equal(1)
      expect(userInfo.initSellAmount).to.equal(ethers.utils.parseEther('0.0080'))
      expect(userInfo.totalNFTpoint).to.equal(ethers.utils.parseEther('0'))
      expect(userInfo.totalFTpoint).to.equal(ethers.utils.parseEther('0'))
    })
    it('MAIN:FTの流動性を解除するとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      await expect(router.connect(staker).withdrawFT(singleERC20NOPool.address, 1, [])).to.emit(router, 'WithdrawFT')
      let afterBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
    })
    it('MAIN:流動性を解除するからsellNumを0にする', async () => {
      poolInfo = await singleERC20NOPool.getPoolInfo()
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
    })
  })
  describe('FTをステーキング → NFTからFTにスワップ  → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.011
    //stakeNFTprice: 0.011
    it('MAIN:FTをステーキングするとEventが発行される', async () => {
      await sampleFT.connect(staker).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.0080'))
      expect(await router.connect(staker).stakeFT(singleERC20NOPool.address, 1)).to.emit(router, 'StakeFT')
    })
    it('MAIN:FTからNFTにスワップするとEventが発行される', async () => {
      await sampleNFT.connect(swapperNFTforFT).approve(singleERC20NOPool.address, 9)
      expect(
        await router
          .connect(swapperNFTforFT)
          .swapNFTforFT(singleERC20NOPool.address, ['9'], ethers.utils.parseEther('0.0072'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(9)).to.equal(singleERC20NOPool.address)
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      await expect(router.connect(staker).withdrawFT(singleERC20NOPool.address, 0, ['9'])).to.emit(router, 'WithdrawFT')
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(9)).to.equal(staker.address)
    })
  })

  describe('FTをステーキング → NFTからFTにスワップ → FTからNFTにスワップ → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.01
    //stakeNFTprice: 0.01
    it('GET:stakeNFTprice', async () => {
      expect(await singleERC20NOPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await singleERC20NOPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('MAIN:FTをステーキングするとEventが発行される', async () => {
      await sampleFT.connect(staker).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.0072'))
      expect(await router.connect(staker).stakeFT(singleERC20NOPool.address, 1)).to.emit(router, 'StakeFT')
    })
    it('MAIN:FTからNFTにスワップするとEventが発行される', async () => {
      await sampleNFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, 10)
      expect(
        await router
          .connect(swapperFTforNFT)
          .swapNFTforFT(singleERC20NOPool.address, ['10'], ethers.utils.parseEther('0.0072'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('MAIN:FTからNFTにスワップするとEventが発行される', async () => {
      Balance = await sampleFT.connect(swapperFTforNFT).balanceOf(swapperFTforNFT.address)
      console.log(Balance)
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.009'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(singleERC20NOPool.address, ['10'], supporter1.address)
      ).to.emit(router, 'SwapFTforNFT')
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      await expect(router.connect(staker).withdrawFT(singleERC20NOPool.address, 1, [])).to.emit(router, 'WithdrawFT')
      let afterBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':流動性報酬の受け取り')
    })
    it('MAIN:サポーターFeeが適切にもらえる', async () => {
      let beforBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(paymentAddress)
      let afterBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':サポーター受け取り')
    })
    it('MAIN:ProtocolFeeが適切にもらえる', async () => {
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)

      await router.connect(owner).withdrawProtocolFee(paymentAddress)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
    })
  })

  describe('プールを作成したユーザー以外はFTをステーキングできない', () => {
    it('他のユーザーがステーキングしようとするとRevertする', async () => {
      await sampleFT.connect(staker2).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.0072'))
      await expect(
        router.connect(staker2).stakeFT(singleERC20NOPool.address, 1, {
          value: ethers.utils.parseEther('0.0072')
        })
      ).to.be.revertedWith('Not Owner')
    })
  })

  describe('NFTをステーキング → FTをステーキング → NFTからFTにスワップ → FTからNFTにスワップ → 流動性解除', () => {
    it('NFTをステーキングするとEventが発行される', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      await sampleNFT.connect(staker).approve(singleERC20NOPool.address, 13)
      expect(await router.connect(staker).stakeNFT(singleERC20NOPool.address, ['13'])).to.emit(router, 'StakeNFT')
    })
    it('FTをステーキングするとEventが発行される', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      await sampleFT.connect(staker).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.0072'))
      expect(await router.connect(staker).stakeFT(singleERC20NOPool.address, 1)).to.emit(router, 'StakeFT')
    })
    it('FTからNFTにスワップするとEventが発行される', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.01'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(singleERC20NOPool.address, ['13'], supporter1.address)
      ).to.emit(router, 'SwapFTforNFT')
    })
    it('FTからNFTにスワップするとEventが発行される', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      await sampleNFT.connect(swapperNFTforFT).approve(singleERC20NOPool.address, 14)
      expect(
        await router
          .connect(swapperNFTforFT)
          .swapNFTforFT(singleERC20NOPool.address, ['14'], ethers.utils.parseEther('0.0080'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('NFTの流動性を解除するとEventが発行される', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      await expect(router.connect(staker).withdrawNFT(singleERC20NOPool.address, ['14'])).to.emit(router, 'WithdrawNFT')
      let afterBalance = await ethers.provider.getBalance(staker.address)
      expect(afterBalance - beforBalance).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':StakerNFTの実際の流動性報酬')
    })
    it('FTの流動性を解除するとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      await expect(router.connect(staker).withdrawFT(singleERC20NOPool.address, 1, [])).to.emit(router, 'WithdrawFT')
      let afterBalance = await sampleFT.connect(staker).balanceOf(staker.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':流動性報酬の受け取り')
    })
    it('MAIN:サポーターFeeが適切にもらえる', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(paymentAddress)
      let afterBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':サポーター受け取り')
    })
    it('MAIN:ProtocolFeeが適切にもらえる', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)

      await router.connect(owner).withdrawProtocolFee(paymentAddress)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
      let Balance2 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance2 + ':Routerの残高')
    })
  })

  describe('2個目のプールを作成', () => {
    it('Factory721によるプールの作成', async function () {
      pool721Address2 = await factorySingleERC20NOPool
        .connect(staker)
        .createPool(sampleNFT.address, bondingCurve.address, spotPrice, delta, spread, sampleFT.address)
      pool721pend2 = await (await pool721Address2).wait()
      await expect(pool721Address2).to.emit(factorySingleERC20NOPool, 'CreatePool')
    })
    it('作成したプールのアドレスを確認', async function () {
      const createPooled = pool721pend2.events.find((event) => event.event === 'CreatePool')
      ;[pool721tast2] = createPooled.args
      expect(pool721tast2).to.not.be.null
    })
    it('プールのインスタンス化', async function () {
      const Pool721 = await ethers.getContractFactory('SingleNativeOPool')
      singleERC20NOPool2 = await new ethers.Contract(
        pool721tast2,
        Pool721.interface.format(),
        factorySingleERC20NOPool.signer
      )
    })
  })

  describe('2個目のプールを作成', () => {
    it('2プールに2つのNFTをステーク', async function () {
      await sampleNFT.connect(staker).approve(singleERC20NOPool.address, 15)
      await sampleNFT.connect(staker).approve(singleERC20NOPool2.address, 16)
      await router
        .connect(staker)
        .batchStakeNFT([singleERC20NOPool.address, singleERC20NOPool2.address], [[['15']], [['16']]])
    })
    it('NFTはプールが持っている', async function () {
      expect(await sampleNFT.ownerOf(15)).to.equal(singleERC20NOPool.address)
      expect(await sampleNFT.ownerOf(16)).to.equal(singleERC20NOPool2.address)
    })
    it('2プールに2つのFTをステーク', async function () {
      await sampleFT.connect(staker).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.0072'))
      await sampleFT.connect(staker).approve(singleERC20NOPool2.address, ethers.utils.parseEther('0.0072'))
      await router.connect(staker).batchStakeFT([singleERC20NOPool.address, singleERC20NOPool2.address], [1, 1])
    })
    it('2プールからFT->NFT', async function () {
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool.address, ethers.utils.parseEther('0.011'))
      await sampleFT.connect(swapperFTforNFT).approve(singleERC20NOPool2.address, ethers.utils.parseEther('0.011'))

      await router
        .connect(swapperFTforNFT)
        .batchSwapFTforNFT(
          [singleERC20NOPool.address, singleERC20NOPool2.address],
          [[['15']], [['16']]],
          supporter1.address
        )
    })
    it('2プールからNFT->FT', async function () {
      await sampleNFT.connect(swapperNFTforFT).approve(singleERC20NOPool.address, 17)
      await sampleNFT.connect(swapperNFTforFT).approve(singleERC20NOPool2.address, 18)
      let beforBalance = await sampleFT.connect(owner).balanceOf(router.address)
      await router
        .connect(swapperNFTforFT)
        .batchSwapNFTforFT(
          [singleERC20NOPool.address, singleERC20NOPool2.address],
          [[['17']], [['18']]],
          [ethers.utils.parseEther('0.008'), ethers.utils.parseEther('0.008')],
          supporter1.address
        )
      let afterBalance = await sampleFT.connect(owner).balanceOf(router.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':Routerが受け取ったプロトコル手数料')
    })
    it('MAIN:サポーターFeeが適切にもらえる', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(paymentAddress)
      let afterBalance = await sampleFT.connect(supporter1).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':サポーター受け取り')
    })
    it('MAIN:ProtocolFeeが適切にもらえる', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)

      await router.connect(owner).withdrawProtocolFee(paymentAddress)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':プロトコル受け取り')
      let Balance2 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance2 + ':Routerの残高')
    })
  })
})
