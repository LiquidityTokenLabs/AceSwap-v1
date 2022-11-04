const { expect } = require('chai')
const { ethers } = require('hardhat')

let spotPrice = ethers.utils.parseEther('0.01')
let delta = ethers.utils.parseEther('0.001')
let spread = ethers.utils.parseEther('0.2')
let protocolFeeRatio = ethers.utils.parseEther('0.2')

describe('プール別テスト(PairERC20OPool)', function () {
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
    FactoryPairERC20NOPool = await ethers.getContractFactory('FactoryPairERC20NOPool')
    factoryPairERC20NOPool = await FactoryPairERC20NOPool.deploy(router.address, protocolFeeRatio)
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(staker2).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    //10
    await sampleNFT.connect(swapperFTforNFT).mint()
    await sampleNFT.connect(staker2).mint()
    await sampleNFT.connect(staker).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(swapperNFTforFT).mint()
    await sampleNFT.connect(staker).mint()
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
      await router.setFactoryApprove(factoryPairERC20NOPool.address, true)
      expect(await router.getIsFactoryApprove(factoryPairERC20NOPool.address)).to.true
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
      pool721Address = await factoryPairERC20NOPool
        .connect(staker)
        .createPool(sampleNFT.address, bondingCurve.address, spotPrice, delta, spread, sampleFT.address)
      pool721pend = await (await pool721Address).wait()
      await expect(pool721Address).to.emit(factoryPairERC20NOPool, 'CreatePool')
    })
    it('GET:作成したプールのアドレスを確認', async function () {
      const createPooled = pool721pend.events.find((event) => event.event === 'CreatePool')
      ;[pool721tast] = createPooled.args
      expect(pool721tast).to.not.be.null
      // (pool721tast)
    })
    it('GET:プールのインスタンス化', async function () {
      const Pool721 = await ethers.getContractFactory('SingleNativeOPool')
      pairERC20OPool = await new ethers.Contract(pool721tast, Pool721.interface.format(), factoryPairERC20NOPool.signer)
    })
  })

  describe('プールの初期状態の確認', () => {
    it('GET:ボンディングカーブは設定したアドレスに等しい', async function () {
      bondingCurveAddress = await pairERC20OPool.bondingCurve()
      expect(bondingCurveAddress).to.equal(bondingCurve.address)
    })
    it('GET:コレクションは設定したアドレスに等しい', async function () {
      collectionAddress = await pairERC20OPool.collection()
      expect(collectionAddress).to.equal(sampleNFT.address)
    })
    it('GET:Routerは設定したアドレスに等しい', async function () {
      routerAddress = await pairERC20OPool.router()
      expect(routerAddress).to.equal(router.address)
    })
    it('GET:ProtocolFeeRatioは設定した値に等しい', async function () {
      tmpProtocolFeeRatio = await pairERC20OPool.protocolFeeRatio()
      expect(tmpProtocolFeeRatio).to.equal(protocolFeeRatio)
    })
    it('GET:buyEventNumは設定した値に等しい', async function () {
      buyEventNum = await pairERC20OPool.buyEventNum()
      expect(buyEventNum).to.equal(0)
    })
    it('GET:sellEventNumは設定した値に等しい', async function () {
      sellEventNum = await pairERC20OPool.sellEventNum()
      expect(sellEventNum).to.equal(0)
    })
    it('GET:stakeNFTpriceは設定した値に等しい', async function () {
      stakeNFTprice = await pairERC20OPool.stakeNFTprice()
      expect(stakeNFTprice).to.equal(spotPrice)
    })
    it('GET:stakeFTpriceは設定した値に等しい', async function () {
      stakeFTprice = await pairERC20OPool.stakeFTprice()
      expect(stakeFTprice).to.equal(spotPrice)
    })
    it('GET:poolInfoは設定した値に等しい', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(spotPrice)
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(delta)
      expect(poolInfo.spread).to.equal(spread)
    })
    it('GET:paymentAddressは設定した値に等しい', async function () {
      paymentAddress = await pairERC20OPool.paymentToken()
      expect(paymentAddress).to.equal(sampleFT.address)
    })
    it('GET:他のユーザーはステークできる(isOtherStakeはtrue)', async function () {
      isOtherStake = await pairERC20OPool.isOtherStake()
      expect(isOtherStake).to.not.true
    })
    it('GET:ペアでステーキングする必要がある(isPairがfalse)', async function () {
      isPair = await pairERC20OPool.isPair()
      expect(isPair).to.true
    })
  })

  let spotPrice1 = ethers.utils.parseEther('0.01')
  describe('ボンディングカーブの計算が正しいか検証', () => {
    it('GET:適切な計算がされる', async () => {
      totalFee = await pairERC20OPool.getCalcSellInfo(4, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0.024'))
    })
    it('GET:適切な計算がされる', async () => {
      totalFee = await pairERC20OPool.getCalcBuyInfo(4, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0.046'))
    })
    it('GET:個数が多すぎて元の数を割る場合は0に近い形で調整される', async () => {
      totalFee = await pairERC20OPool.getCalcSellInfo(12, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0.0352'))
    })
    it('GET:個数が0だとエラーが出て全て0になる', async () => {
      totalFee = await pairERC20OPool.getCalcSellInfo(0, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0'))
    })
    it('GET:個数が0だとエラーが出て全て0になる', async () => {
      totalFee = await pairERC20OPool.getCalcBuyInfo(0, spotPrice1)
      expect(totalFee).to.equal(ethers.utils.parseEther('0'))
    })
    let maxSpotPrice = ethers.utils.parseEther('1000000000000000000')
    it('GET:過剰に大きな数を入れるとエラーが出て全て0になる', async () => {
      totalFee = await pairERC20OPool.getCalcBuyInfo(0, maxSpotPrice)
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

  describe('ペアでステーキング → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.01
    //stakeNFTprice: 0.01
    it('GET:プールの初期状態の確認', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
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
      await sampleNFT.connect(staker).approve(pairERC20OPool.address, 1)
      await sampleFT.connect(staker).approve(pairERC20OPool.address, ethers.utils.parseEther('0.0080'))
      expect(await router.connect(staker).stake(pairERC20OPool.address, ['1'])).to.emit(router, 'Stake')
    })
    it('GET:NFTが元の所有者であるstakerAになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(pairERC20OPool.address)
    })
    it('GET:ステーキングされたことでBuyNumが増える', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.buyNum).to.equal(1)
    })
    it('GET:stakeNFTPriceは需要に合わせて増加する', async () => {
      expect(await pairERC20OPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      await expect(router.connect(staker).withdraw(pairERC20OPool.address, 1, ['1'])).to.emit(router, 'Withdraw')
    })
    it('GET:NFTが元の所有者であるstakerAになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(staker.address)
    })
    it('GET:[状態確認]poolInfoの状態は想定通りである', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.01'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
  })

  describe('ペアでステーキング → FTでスワップ → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.01
    //stakeNFTprice: 0.01
    it('GET:buyEventNum &sellEventNum', async () => {
      buyEventNum = await pairERC20OPool.buyEventNum()
      sellEventNum = await pairERC20OPool.sellEventNum()
      console.log(buyEventNum.toString() + ':buyEventNum')
      console.log(sellEventNum.toString() + ':sellEventNum')
    })
    it('GET:stakeNFTprice', async () => {
      expect(await pairERC20OPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await pairERC20OPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:[状態確認]poolInfoの状態は想定通りである', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
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
      await sampleFT.connect(staker).approve(pairERC20OPool.address, ethers.utils.parseEther('0.0080'))
      await sampleNFT.connect(staker).approve(pairERC20OPool.address, 1)
      expect(await router.connect(staker).stake(pairERC20OPool.address, ['1'])).to.emit(router, 'Stake')
    })

    it('GET:NFTがステーキングされたことでプールになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(pairERC20OPool.address)
    })
    it('GET:ステーキングによってbuyNumが増える', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.buyNum).to.equal(1)
    })
    it('MAIN:FTからNFTにスワップをするとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      await sampleFT.connect(swapperFTforNFT).approve(pairERC20OPool.address, ethers.utils.parseEther('0.01'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(pairERC20OPool.address, ['1'], supporter1.address)
      ).to.emit(router, 'SwapFTforNFT')
      let afterBalance = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      expect(afterBalance.sub(beforBalance)).to.equal(ethers.utils.parseEther('0.01'))
      // (afterBalance - beforBalance);
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(1)).to.equal(swapperFTforNFT.address)
    })
    it('GET:spotPricaが増加してbuyNumが減り、sellNumが増える', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(2)
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      expect(await router.connect(staker).withdraw(pairERC20OPool.address, 2, [])).to.emit(router, 'Withdraw')
    })
    it('GET:流動性解除によりsellNumが減る', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(0)
    })
  })

  describe('ペアでステーキング → FTからNFTにスワップ → NFTからFTにスワップ → 流動性解除', () => {
    //spotPrice: 0.011
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.011
    //stakeNFTprice: 0.011
    it('GET:buyEventNum &sellEventNum', async () => {
      buyEventNum = await pairERC20OPool.buyEventNum()
      sellEventNum = await pairERC20OPool.sellEventNum()
      console.log(buyEventNum.toString() + ':buyEventNum')
      console.log(sellEventNum.toString() + ':sellEventNum')
    })

    it('GET:stakeFTprice &stakeNFTprice', async () => {
      stakeFTprice = await pairERC20OPool.stakeFTprice()
      stakeNFTprice = await pairERC20OPool.stakeNFTprice()
      console.log(stakeFTprice.toString() + ':stakeFTprice')
      console.log(stakeNFTprice.toString() + ':stakeNFTprice')
    })
    it('GET:stakeNFTprice', async () => {
      expect(await pairERC20OPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await pairERC20OPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.011'))
    })
    it('GET:stakeFTprice &stakeNFTprice', async () => {
      stakeFTprice = await pairERC20OPool.stakeFTprice()
      stakeNFTprice = await pairERC20OPool.stakeNFTprice()
      console.log(stakeFTprice.toString() + ':stakeFTprice')
      console.log(stakeNFTprice.toString() + ':stakeNFTprice')
    })
    it('GET:buyEventNum &sellEventNum', async () => {
      buyEventNum = await pairERC20OPool.buyEventNum()
      sellEventNum = await pairERC20OPool.sellEventNum()
      console.log(buyEventNum.toString() + ':buyEventNum')
      console.log(sellEventNum.toString() + ':sellEventNum')
    })
    it('GET:[状態確認]poolInfo', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
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
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      await sampleFT.connect(staker).approve(pairERC20OPool.address, ethers.utils.parseEther('0.009'))
      await sampleNFT.connect(staker).approve(pairERC20OPool.address, 2)
      expect(await router.connect(staker).stake(pairERC20OPool.address, ['2'])).to.emit(router, 'Stake')
    })
    // it("MAIN:NFTをステーキングするとEventが発行される", async () => {
    //   await sampleNFT.connect(staker).approve(pairERC20OPool.address, 2);
    //   expect(
    //     await router.connect(staker).stakeNFT(pairERC20OPool.address, ["2"])
    //   ).to.emit(router, "StakeNFT");
    // });
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(2)).to.equal(pairERC20OPool.address)
    })
    it('GET:[状態確認]buyNumが1増える', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(1)
      expect(poolInfo.sellNum).to.equal(1)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:FTからNFTにスワップをするとEventが発行される', async () => {
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      await sampleFT.connect(swapperFTforNFT).approve(pairERC20OPool.address, ethers.utils.parseEther('0.016'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(pairERC20OPool.address, ['2'], supporter1.address)
      ).to.emit(router, 'SwapFTforNFT')
    })
    it('GET:[状態確認]buyNumが1減って、sellNumが1増える、spotPriceが増える', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.012'))
      expect(poolInfo.buyNum).to.equal(0)
      expect(poolInfo.sellNum).to.equal(2)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:NFTからFTにスワップするとEventが発行される', async () => {
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      await sampleNFT.connect(swapperNFTforFT).approve(pairERC20OPool.address, 3)
      expect(
        await router
          .connect(swapperNFTforFT)
          .swapNFTforFT(pairERC20OPool.address, ['3'], ethers.utils.parseEther('0.0088'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('GET:[状態確認]sellNumが1減って、buyNumが1増える、spotPriceが減る', async () => {
      poolInfo = await pairERC20OPool.getPoolInfo()
      expect(poolInfo.spotPrice).to.equal(ethers.utils.parseEther('0.011'))
      expect(poolInfo.buyNum).to.equal(1)
      expect(poolInfo.sellNum).to.equal(1)
      expect(poolInfo.delta).to.equal(ethers.utils.parseEther('0.001'))
      expect(poolInfo.spread).to.equal(ethers.utils.parseEther('0.2'))
    })
    it('MAIN:NFTの流動性を解除すると流動性報酬が入り残高が増える', async () => {
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(staker.address)
      expect(await router.connect(staker).withdraw(pairERC20OPool.address, 1, ['3'])).to.emit(router, 'WithdrawNFT')
      let afterBalance = await sampleFT.connect(owner).balanceOf(staker.address)
      expect(afterBalance - beforBalance).to.above(0)
      afterBalance - beforBalance
    })
    it('GET:[状態確認]buyNumが1減る', async () => {
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      poolInfo = await pairERC20OPool.getPoolInfo()
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
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(sampleFT.address)
      let afterBalance = await sampleFT.connect(owner).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(ethers.utils.parseEther('0.00009'))
    })
    it('MAIN:ProtocolFeeが適切にもらえる', async () => {
      let Balance3 = await sampleFT.connect(owner).balanceOf(pairERC20OPool.address)
      console.log(Balance3.toString() + ':Poolの残高')
      let Balance4 = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance4.toString() + ':Routerの残高')
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance)

      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      await router.connect(owner).withdrawProtocolFee(sampleFT.address)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(ethers.utils.parseEther('0.00027'))
    })
  })

  describe('プールを作成したユーザー以外はFTをステーキングできない', () => {
    it('他のユーザーがステーキングしようとするとRevertする', async () => {
      await sampleNFT.connect(staker2).approve(pairERC20OPool.address, 12)
      await sampleFT.connect(staker2).approve(pairERC20OPool.address, ethers.utils.parseEther('0.01'))
      await expect(router.connect(staker2).stake(pairERC20OPool.address, ['12'])).to.be.revertedWith('Not Owner')
    })
  })

  //   describe("2人がペアでステーキング → FTからNFTにスワップ → NFTからFTにスワップ → 流動性解除", () => {
  //     it("GET:buyEventNum &sellEventNum", async () => {
  //       buyEventNum = await pairERC20OPool.buyEventNum();
  //       sellEventNum = await pairERC20OPool.sellEventNum();
  //       console.log(buyEventNum.toString() + ":buyEventNum");
  //       console.log(sellEventNum.toString() + ":sellEventNum");
  //     });
  //     it("NFTをステーキングするとEventが発行される", async () => {
  //       let Balance = await ethers.provider.getBalance(pairERC20OPool.address);
  //       console.log(Balance.toString() + ":Poolの残高");
  //       let Balance2 = await sampleFT.connect(owner).balanceOf(router.address);
  //       console.log(Balance2.toString() + ":Routerの残高");
  //       await sampleNFT.connect(staker).approve(pairERC20OPool.address, 5);
  //       await sampleFT
  //         .connect(staker)
  //         .approve(pairERC20OPool.address, ethers.utils.parseEther("0.008"));
  //       await expect(
  //         router.connect(staker).stake(pairERC20OPool.address, ["5"])
  //       ).to.emit(router, "Stake");
  //     });
  //     it("GET:[状態確認]userInfo", async () => {
  //       userInfo = await pairERC20OPool.getUserInfo(staker.address);
  //       expect(userInfo.initBuyNum).to.equal(1);
  //       expect(userInfo.initSellNum).to.equal(1);
  //       expect(userInfo.initSellAmount).to.equal(
  //         ethers.utils.parseEther("0.008")
  //       );
  //       expect(userInfo.totalNFTpoint).to.equal(ethers.utils.parseEther("0.011"));
  //       expect(userInfo.totalFTpoint).to.equal(ethers.utils.parseEther("0.008"));
  //     });
  //     it("NFTをステーキングするとEventが発行される", async () => {
  //       await sampleNFT.connect(staker2).approve(pairERC20OPool.address, 6);
  //       await sampleFT
  //         .connect(staker2)
  //         .approve(pairERC20OPool.address, ethers.utils.parseEther("0.0072"));
  //       expect(
  //         await router.connect(staker2).stake(pairERC20OPool.address, ["6"])
  //       ).to.emit(router, "StakeNFT");
  //     });
  //     it("GET:[状態確認]userInfo", async () => {
  //       userInfo = await pairERC20OPool.getUserInfo(staker2.address);
  //       expect(userInfo.initBuyNum).to.equal(1);
  //       expect(userInfo.initSellNum).to.equal(1);
  //       expect(userInfo.initSellAmount).to.equal(
  //         ethers.utils.parseEther("0.0072")
  //       );
  //       expect(userInfo.totalNFTpoint).to.equal(ethers.utils.parseEther("0.012"));
  //       expect(userInfo.totalFTpoint).to.equal(ethers.utils.parseEther("0.0072"));
  //     });
  //     it("MAIN:FTからNFTにスワップをするとEventが発行される", async () => {
  //       await sampleFT
  //         .connect(swapperFTforNFT)
  //         .approve(pairERC20OPool.address, ethers.utils.parseEther("0.023"));
  //       expect(
  //         await router
  //           .connect(swapperFTforNFT)
  //           .swapFTforNFT(pairERC20OPool.address, ["5", "6"], supporter1.address)
  //       ).to.emit(router, "SwapFTforNFT");
  //     });
  //     it("MAIN:NFTからFTにスワップをするとEventが発行される", async () => {
  //       await sampleNFT
  //         .connect(swapperNFTforFT)
  //         .approve(pairERC20OPool.address, 7);
  //       await sampleNFT
  //         .connect(swapperNFTforFT)
  //         .approve(pairERC20OPool.address, 8);
  //       expect(
  //         await router
  //           .connect(swapperNFTforFT)
  //           .swapNFTforFT(
  //             pairERC20OPool.address,
  //             ["7", "8"],
  //             ethers.utils.parseEther("0.0184"),
  //             supporter1.address
  //           )
  //       ).to.emit(router, "SwapNFTforFT");
  //     });
  //     //0.00176 -> 0.00158
  //     it("MAIN:NFTの流動性を解除すると報酬が入り残高が増える", async () => {
  //       let beforBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker.address);
  //       await expect(
  //         router.connect(staker).withdraw(pairERC20OPool.address, 1, ["7"])
  //       ).to.emit(router, "Withdraw");
  //       let afterBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00157")
  //       );
  //     });
  //     //0.00192 -> 0.00172
  //     it("MAIN:NFTの流動性を解除すると報酬が入り残高が増える", async () => {
  //       let beforBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker2.address);

  //       await expect(
  //         router.connect(staker2).withdraw(pairERC20OPool.address, 1, ["8"])
  //       ).to.emit(router, "Withdraw");
  //       let afterBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker2.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00172")
  //       );
  //       let Balance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(pairERC20OPool.address);
  //       console.log(Balance + ":Poolの残高");
  //     });
  //     it("サポーターFeeが適切にもらえる(routerの残高の確認)", async () => {
  //       let Balance = await sampleFT.connect(owner).balanceOf(router.address);
  //       console.log(Balance + ":Routerの残高");
  //       let beforBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(supporter1.address);
  //       await router.connect(supporter1).withdrawSupportFee(sampleFT.address);
  //       let afterBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(supporter1.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00008")
  //       );
  //       console.log(
  //         afterBalance.sub(beforBalance).toString() + ":サポータ-の受け取った量"
  //       );
  //     });
  //     it("ProtocolFeeが適切にもらえる(routerの残高の確認)", async () => {
  //       let Balance = await sampleFT.connect(owner).balanceOf(router.address);
  //       console.log(Balance + ":Routerの残高");
  //       let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address);
  //       await router.connect(owner).withdrawProtocolFee(sampleFT.address);
  //       let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00024")
  //       );
  //       console.log(
  //         afterBalance.sub(beforBalance).toString() + ":オーナーが受け取った量"
  //       );
  //     });
  //   });
  describe('ペアでステーキング → NFTからFTにスワップ  → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.011
    //stakeNFTprice: 0.011
    it('MAIN:FTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(pairERC20OPool.address, 9)
      await sampleFT.connect(staker).approve(pairERC20OPool.address, ethers.utils.parseEther('0.008'))
      expect(
        await router.connect(staker).stake(pairERC20OPool.address, ['9'], {
          value: ethers.utils.parseEther('0.0080')
        })
      ).to.emit(router, 'StakeFT')
    })
    it('MAIN:FTからNFTにスワップするとEventが発行される', async () => {
      await sampleNFT.connect(swapperNFTforFT).approve(pairERC20OPool.address, 10)
      expect(
        await router
          .connect(swapperNFTforFT)
          .swapNFTforFT(pairERC20OPool.address, ['10'], ethers.utils.parseEther('0.0080'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(10)).to.equal(pairERC20OPool.address)
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      await expect(router.connect(staker).withdraw(pairERC20OPool.address, 0, ['9', '10'])).to.emit(router, 'Withdraw')
    })
    it('GET:NFTの所有者がswapperFTforNFTになる', async () => {
      expect(await sampleNFT.ownerOf(10)).to.equal(staker.address)
    })
  })

  describe('ペアでステーキング → NFTからFTにスワップ → FTからNFTにスワップ → 流動性解除', () => {
    //spotPrice: 0.01
    //sellNum: 0
    //buyNum: 0
    //stakeFTprice: 0.01
    //stakeNFTprice: 0.01
    it('GET:stakeNFTprice', async () => {
      expect(await pairERC20OPool.stakeNFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('GET:stakeFTprice', async () => {
      expect(await pairERC20OPool.stakeFTprice()).to.equal(ethers.utils.parseEther('0.01'))
    })
    it('MAIN:FTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(pairERC20OPool.address, 10)
      await sampleFT.connect(staker).approve(pairERC20OPool.address, ethers.utils.parseEther('0.0072'))
      await expect(router.connect(staker).stake(pairERC20OPool.address, ['10'])).to.emit(router, 'Stake')
    })
    it('MAIN:FTからNFTにスワップするとEventが発行される', async () => {
      await sampleNFT.connect(swapperFTforNFT).approve(pairERC20OPool.address, 11)
      expect(
        await router
          .connect(swapperFTforNFT)
          .swapNFTforFT(pairERC20OPool.address, ['11'], ethers.utils.parseEther('0.0072'), supporter1.address)
      ).to.emit(router, 'SwapNFTforFT')
    })
    it('MAIN:FTからNFTにスワップするとEventが発行される', async () => {
      await sampleFT.connect(swapperFTforNFT).approve(pairERC20OPool.address, ethers.utils.parseEther('0.009'))
      expect(
        await router.connect(swapperFTforNFT).swapFTforNFT(pairERC20OPool.address, ['10'], supporter1.address)
      ).to.emit(router, 'SwapFTforNFT')
    })
    it('MAIN:NFTの流動性を解除するとEventが発行される', async () => {
      let beforBalance = await sampleFT.connect(owner).balanceOf(staker.address)
      await expect(router.connect(staker).withdraw(pairERC20OPool.address, 1, ['11'])).to.emit(router, 'Withdraw')
      let afterBalance = await sampleFT.connect(owner).balanceOf(staker.address)
      expect(afterBalance - beforBalance).to.above(0)
      console.log(afterBalance - beforBalance)
    })
    it('サポーターFeeが適切にもらえる(routerの残高の確認)', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(sampleFT.address)
      let afterBalance = await sampleFT.connect(owner).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(ethers.utils.parseEther('0.00006'))
      console.log(afterBalance.sub(beforBalance).toString() + ':サポータ-の受け取った量')
    })
    it('ProtocolFeeが適切にもらえる(routerの残高の確認)', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      await router.connect(owner).withdrawProtocolFee(sampleFT.address)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(ethers.utils.parseEther('0.00018'))
      console.log(afterBalance.sub(beforBalance).toString() + ':オーナーが受け取った量')
    })
  })

  //   describe("2人がペアでステーキング → FTからNFTにスワップ → NFTからFTにスワップ → 流動性解除", () => {
  //     //spotPrice: 0.01
  //     //sellNum: 0
  //     //buyNum: 0
  //     //stakeFTprice: 0.01
  //     //stakeNFTprice: 0.01
  //     it("FTをステーキングするとEventが発行される", async () => {
  //       await sampleNFT.connect(staker).approve(pairERC20OPool.address, 11);
  //       await sampleFT
  //         .connect(staker)
  //         .approve(pairERC20OPool.address, ethers.utils.parseEther("0.0072"));
  //       expect(
  //         await router.connect(staker).stake(pairERC20OPool.address, ["11"])
  //       ).to.emit(router, "Stake");
  //     });
  //     it("FTをステーキングするとEventが発行される", async () => {
  //       await sampleNFT.connect(staker2).approve(pairERC20OPool.address, 12);
  //       await sampleFT
  //         .connect(staker2)
  //         .approve(pairERC20OPool.address, ethers.utils.parseEther("0.0064"));
  //       expect(
  //         await router.connect(staker2).stake(pairERC20OPool.address, ["12"])
  //       ).to.emit(router, "Stake");
  //     });
  //     it("NFTからFTにスワップするとEventが発行される", async () => {
  //       await sampleNFT
  //         .connect(swapperNFTforFT)
  //         .approve(pairERC20OPool.address, 13);
  //       await sampleNFT
  //         .connect(swapperNFTforFT)
  //         .approve(pairERC20OPool.address, 14);
  //       expect(
  //         await router
  //           .connect(swapperNFTforFT)
  //           .swapNFTforFT(
  //             pairERC20OPool.address,
  //             ["13", "14"],
  //             ethers.utils.parseEther("0.0136"),
  //             supporter1.address
  //           )
  //       ).to.emit(router, "SwapNFTforFT");
  //     });
  //     it("FTからNFTにスワップするとEventが発行される", async () => {
  //       await sampleFT
  //         .connect(swapperFTforNFT)
  //         .approve(pairERC20OPool.address, ethers.utils.parseEther("0.017"));
  //       expect(
  //         await router
  //           .connect(swapperFTforNFT)
  //           .swapFTforNFT(
  //             pairERC20OPool.address,
  //             ["11", "12"],
  //             supporter1.address
  //           )
  //       ).to.emit(router, "SwapFTforNFT");
  //     });
  //     it("NFTの流動性を解除するとEventが発行される", async () => {
  //       let beforBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker.address);
  //       await expect(
  //         router.connect(staker).withdraw(pairERC20OPool.address, 1, ["13"])
  //       ).to.emit(router, "Withdraw");
  //       let afterBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00082")
  //       );
  //       console.log(
  //         afterBalance.sub(beforBalance).toString() + ":StakerFTが受け取った量"
  //       );
  //     });
  //     it("NFTの流動性を解除するとEventが発行される", async () => {
  //       let beforBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker2.address);
  //       await expect(
  //         router.connect(staker2).withdraw(pairERC20OPool.address, 1, ["14"])
  //       ).to.emit(router, "Withdraw");
  //       let afterBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(staker2.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00072")
  //       );
  //       console.log(
  //         afterBalance.sub(beforBalance).toString() + ":StakerFT2が受け取った量"
  //       );
  //     });
  //     it("サポーターFeeが適切にもらえる(routerの残高の確認)", async () => {
  //       let Balance = await sampleFT.connect(owner).balanceOf(router.address);
  //       console.log(Balance + ":Routerの残高");
  //       let beforBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(supporter1.address);
  //       await router.connect(supporter1).withdrawSupportFee(sampleFT.address);
  //       let afterBalance = await sampleFT
  //         .connect(owner)
  //         .balanceOf(supporter1.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00008")
  //       );
  //       console.log(
  //         afterBalance.sub(beforBalance).toString() + ":サポータ-の受け取った量"
  //       );
  //     });
  //     it("ProtocolFeeが適切にもらえる(routerの残高の確認)", async () => {
  //       let Balance = await sampleFT.connect(owner).balanceOf(router.address);
  //       console.log(Balance + ":Routerの残高");
  //       let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address);
  //       await router.connect(owner).withdrawProtocolFee(sampleFT.address);
  //       let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address);
  //       expect(afterBalance.sub(beforBalance)).to.above(
  //         ethers.utils.parseEther("0.00024")
  //       );
  //       console.log(
  //         afterBalance.sub(beforBalance).toString() + ":オーナーが受け取った量"
  //       );
  //     });
  //   });

  describe('2個目のプールを作成', () => {
    it('Factory721によるプールの作成', async function () {
      pool721Address2 = await factoryPairERC20NOPool
        .connect(staker)
        .createPool(sampleNFT.address, bondingCurve.address, spotPrice, delta, spread, sampleFT.address)
      pool721pend2 = await (await pool721Address2).wait()
      await expect(pool721Address2).to.emit(factoryPairERC20NOPool, 'CreatePool')
    })
    it('作成したプールのアドレスを確認', async function () {
      const createPooled = pool721pend2.events.find((event) => event.event === 'CreatePool')
      ;[pool721tast2] = createPooled.args
      expect(pool721tast2).to.not.be.null
    })
    it('プールのインスタンス化', async function () {
      const Pool721 = await ethers.getContractFactory('PairERC20NOPool')
      pairERC20NOPool2 = await new ethers.Contract(
        pool721tast2,
        Pool721.interface.format(),
        factoryPairERC20NOPool.signer
      )
    })
  })

  describe('ペアステーキング→2プールからFTからNFTにスワップ→2プールからNFTからFTにスワップ→流動性解除', () => {
    it('FTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(pairERC20OPool.address, 13)
      await sampleFT.connect(staker).approve(pairERC20OPool.address, ethers.utils.parseEther('0.0072'))
      expect(await router.connect(staker).stake(pairERC20OPool.address, ['13'])).to.emit(router, 'Stake')
    })
    it('FTをステーキングするとEventが発行される', async () => {
      await sampleNFT.connect(staker).approve(pairERC20NOPool2.address, 17)
      await sampleFT.connect(staker).approve(pairERC20NOPool2.address, ethers.utils.parseEther('0.0072'))
      expect(await router.connect(staker).stake(pairERC20NOPool2.address, ['17'])).to.emit(router, 'Stake')
    })

    it('2プールからFT->NFT(batchSwapFTforNFT)', async function () {
      await sampleFT.connect(swapperFTforNFT).approve(pairERC20OPool.address, ethers.utils.parseEther('0.012'))
      await sampleFT.connect(swapperFTforNFT).approve(pairERC20NOPool2.address, ethers.utils.parseEther('0.012'))
      await router
        .connect(swapperFTforNFT)
        .batchSwapFTforNFT([pairERC20OPool.address, pairERC20NOPool2.address], [[['13']], [['17']]], supporter1.address)
    })
    it('2プールからNFT->FT(batchSwapNFTforFT)', async function () {
      await sampleNFT.connect(swapperNFTforFT).approve(pairERC20OPool.address, 15)
      await sampleNFT.connect(swapperNFTforFT).approve(pairERC20NOPool2.address, 16)
      let beforBalance = await sampleFT.connect(owner).balanceOf(router.address)
      await router
        .connect(swapperNFTforFT)
        .batchSwapNFTforFT(
          [pairERC20OPool.address, pairERC20NOPool2.address],
          [[['15']], [['16']]],
          [ethers.utils.parseEther('0.008'), ethers.utils.parseEther('0.008')],
          supporter1.address
        )
      let afterBalance = await sampleFT.connect(owner).balanceOf(router.address)
      expect(afterBalance - beforBalance).to.above(0)
      console.log(afterBalance.sub(beforBalance).toString() + ':Routerが受け取ったプロトコル手数料')
    })
    it('サポーターFeeが適切にもらえる(routerの残高の確認)', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(supporter1.address)
      await router.connect(supporter1).withdrawSupportFee(sampleFT.address)
      let afterBalance = await sampleFT.connect(owner).balanceOf(supporter1.address)
      expect(afterBalance.sub(beforBalance)).to.above(ethers.utils.parseEther('0.00008'))
      console.log(afterBalance.sub(beforBalance).toString() + ':サポータ-の受け取った量')
    })
    it('ProtocolFeeが適切にもらえる(routerの残高の確認)', async () => {
      let Balance = await sampleFT.connect(owner).balanceOf(router.address)
      console.log(Balance + ':Routerの残高')
      let beforBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      await router.connect(owner).withdrawProtocolFee(sampleFT.address)
      let afterBalance = await sampleFT.connect(owner).balanceOf(owner.address)
      expect(afterBalance.sub(beforBalance)).to.above(ethers.utils.parseEther('0.00024'))
      console.log(afterBalance.sub(beforBalance).toString() + ':オーナーが受け取った量')
    })
  })
})
