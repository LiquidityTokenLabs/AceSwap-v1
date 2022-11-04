import { BigInt } from '@graphprotocol/graph-ts'
import {
  Router,
  OwnershipTransferred,
  Received,
  StakeFT,
  StakeNFT,
  SwapFTforNFT,
  SwapNFTforFT,
  WithdrawFT,
  WithdrawNFT,
  updateBondingCurve,
  updateCollection,
  updatePool
} from '../generated/Router/Router'
import { CollectionPoolList, BondingCurveList, UserStakePoolList } from '../generated/schema'

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleReceived(event: Received): void {}

export function handleStakeFT(event: StakeFT): void {
  let user = event.params.user.toHex()
  let poolAddress = event.params.pool.toHex()
  let account = UserStakePoolList.load(user)
  if (account == null) {
    account = new UserStakePoolList(user)
    account.ftPool = []
    account.nftPool = []
  }
  let ftPool = account.ftPool
  let bool = false
  if (ftPool == null) {
    ftPool = []
  }
  let count = ftPool.length
  for (let i = 0; i < count; i++) {
    if (ftPool[i] == poolAddress) {
      bool = true
    }
  }
  if (bool == false) {
    ftPool.push(poolAddress)
  }
  account.ftPool = ftPool
  account.save()
}

export function handleStakeNFT(event: StakeNFT): void {
  let user = event.params.user.toHex()
  let poolAddress = event.params.pool.toHex()
  let account = UserStakePoolList.load(user)
  if (account == null) {
    account = new UserStakePoolList(user)
    account.ftPool = []
    account.nftPool = []
  }
  let nftPool = account.nftPool
  let bool = false
  if (nftPool == null) {
    nftPool = []
  }
  let count = nftPool.length
  for (let i = 0; i < count; i++) {
    if (nftPool[i] == poolAddress) {
      bool = true
    }
  }
  if (bool == false) {
    nftPool.push(poolAddress)
  }
  account.nftPool = nftPool
  account.save()
}

export function handleSwapFTforNFT(event: SwapFTforNFT): void {}

export function handleSwapNFTforFT(event: SwapNFTforFT): void {}

export function handleWithdrawFT(event: WithdrawFT): void {
  let user = event.params.user.toHex()
  let poolAddress = event.params.pool.toHex()
  let account = UserStakePoolList.load(user)
  if (account == null) {
    account = new UserStakePoolList(user)
    account.ftPool = []
    account.nftPool = []
  }
  let ftPool = account.ftPool
  if (ftPool != null) {
    let count = ftPool.length
    for (let i = 0; i < count; i++) {
      if (ftPool[i] == poolAddress) {
        if (i != count - 1) {
          ftPool[i] = ftPool[count - 1]
        }
        ftPool.pop()
        break
      }
    }
  }
  account.ftPool = ftPool
  account.save()
}

export function handleWithdrawNFT(event: WithdrawNFT): void {
  let user = event.params.user.toHex()
  let poolAddress = event.params.pool.toHex()
  let account = UserStakePoolList.load(user)
  if (account == null) {
    account = new UserStakePoolList(user)
    account.ftPool = []
    account.nftPool = []
  }
  let nftPool = account.ftPool
  if (nftPool != null) {
    let count = nftPool.length
    for (let i = 0; i < count; i++) {
      if (nftPool[i] == poolAddress) {
        if (i != count - 1) {
          nftPool[i] = nftPool[count - 1]
        }
        nftPool.pop()
        break
      }
    }
  }
  account.nftPool = nftPool
  account.save()
}

export function handleupdateBondingCurve(event: updateBondingCurve): void {
  let bondingCurve = event.params.bondingCurve.toHex()
  let account = BondingCurveList.load(bondingCurve)
  if (account == null) {
    account = new BondingCurveList(bondingCurve)
  }
  account.save()
}

export function handleupdateCollection(event: updateCollection): void {
  let collection = event.params.collection.toHex()
  let account = CollectionPoolList.load(collection)
  let approve = event.params.approve
  if (account == null) {
    account = new CollectionPoolList(collection)
  }
  account.approve = approve
  account.save()
}

export function handleupdatePool(event: updatePool): void {
  let collection = event.params.collection.toHex()
  let poolAddress = event.params.pool.toHex()
  let isOtherStake = event.params.isOtherStake
  let account = CollectionPoolList.load(collection)
  if (account == null) {
    account = new CollectionPoolList(collection)
  }
  if (isOtherStake == true) {
    let pool = account.pool
    if (pool != null) {
      pool.push(poolAddress)
    } else if (pool == null) {
      pool = []
      pool.push(poolAddress)
    }
    account.pool = pool
  } else if (isOtherStake == false) {
    let opool = account.opool
    if (opool != null) {
      opool.push(poolAddress)
    } else if (opool == null) {
      opool = []
      opool.push(poolAddress)
    }
    account.opool = opool
  }
  account.save()
}
