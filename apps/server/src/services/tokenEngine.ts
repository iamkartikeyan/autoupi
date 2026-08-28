import { TokenLedgerEntry, TokenSupplySummary } from '@auto-upi/shared';
import { v4 as uuidv4 } from 'uuid';

export class TokenEngine {
  private tokenSymbol: 'TBD' | 'AUST' = 'TBD';
  private totalMinted: number = 8421000;
  private totalTransferred: number = 5210000;
  private totalRedeemed: number = 3211000;
  private outstandingSupply: number = 5210000; // totalMinted - totalRedeemed

  private mintedTxMap: Set<string> = new Set();
  private ledger: TokenLedgerEntry[] = [];

  public getSupplySummary(): TokenSupplySummary {
    return {
      tokenSymbol: this.tokenSymbol,
      totalMinted: this.totalMinted,
      totalTransferred: this.totalTransferred,
      totalRedeemed: this.totalRedeemed,
      outstandingSupply: this.outstandingSupply,
      backingReserveTotalUsd: this.outstandingSupply,
      backingRatio: 1.0, // 100% 1:1 Backed
      lastUpdated: new Date().toISOString(),
    };
  }

  public getLedger(): TokenLedgerEntry[] {
    return this.ledger;
  }

  /**
   * 1. Mint: Creates settlement tokens backed 1:1 by reserve
   * Invariant: Never allows duplicate mint for same transaction ID
   */
  public mint(
    transactionId: string,
    amount: number,
    backingReserveReference: string,
    toAddress: string = '0xSettlementPool_Corridor_IN'
  ): TokenLedgerEntry {
    if (this.mintedTxMap.has(transactionId)) {
      throw new Error(`Token Invariant Violation: Duplicate mint attempted for transaction ${transactionId}`);
    }

    if (amount <= 0) {
      throw new Error('Mint amount must be positive');
    }

    this.mintedTxMap.add(transactionId);
    this.totalMinted += amount;
    this.outstandingSupply += amount;

    const entry: TokenLedgerEntry = {
      id: `tok_${uuidv4().substring(0, 10)}`,
      transactionId,
      type: 'MINT',
      tokenSymbol: this.tokenSymbol,
      amount,
      fromAddress: '0x0000000000000000000000000000000000000000 (Mint Treasury)',
      toAddress,
      backingReserveReference,
      txHash: `0x${uuidv4().replace(/-/g, '')}`,
      blockNumber: 195000 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 2. Transfer: Moves settlement tokens across corridor liquidity pools
   */
  public transfer(
    transactionId: string,
    amount: number,
    fromAddress: string,
    toAddress: string,
    backingReserveReference: string
  ): TokenLedgerEntry {
    if (amount <= 0) throw new Error('Transfer amount must be positive');

    this.totalTransferred += amount;

    const entry: TokenLedgerEntry = {
      id: `tok_${uuidv4().substring(0, 10)}`,
      transactionId,
      type: 'TRANSFER',
      tokenSymbol: this.tokenSymbol,
      amount,
      fromAddress,
      toAddress,
      backingReserveReference,
      txHash: `0x${uuidv4().replace(/-/g, '')}`,
      blockNumber: 195000 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 3. Settle: Confirms on-chain atomic settlement finality
   */
  public settle(
    transactionId: string,
    amount: number,
    poolAddress: string,
    backingReserveReference: string
  ): TokenLedgerEntry {
    const entry: TokenLedgerEntry = {
      id: `tok_${uuidv4().substring(0, 10)}`,
      transactionId,
      type: 'SETTLE',
      tokenSymbol: this.tokenSymbol,
      amount,
      fromAddress: poolAddress,
      toAddress: '0xDomesticPayoutGateway',
      backingReserveReference,
      txHash: `0x${uuidv4().replace(/-/g, '')}`,
      blockNumber: 195000 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 4. Redeem / Burn: Burns settlement tokens when recipient account is credited
   * Invariant: Never allow redemption greater than outstanding supply (no negative supply)
   */
  public redeemAndBurn(
    transactionId: string,
    amount: number,
    fromAddress: string,
    backingReserveReference: string
  ): TokenLedgerEntry {
    if (amount > this.outstandingSupply) {
      throw new Error(`Token Invariant Violation: Cannot burn ${amount} TBD; exceeds outstanding supply of ${this.outstandingSupply}`);
    }

    this.totalRedeemed += amount;
    this.outstandingSupply -= amount;

    const entry: TokenLedgerEntry = {
      id: `tok_${uuidv4().substring(0, 10)}`,
      transactionId,
      type: 'REDEEM_BURN',
      tokenSymbol: this.tokenSymbol,
      amount,
      fromAddress,
      toAddress: '0x0000000000000000000000000000000000000000 (Burn Address)',
      backingReserveReference,
      txHash: `0x${uuidv4().replace(/-/g, '')}`,
      blockNumber: 195000 + Math.floor(Math.random() * 500),
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }
}

export const tokenEngine = new TokenEngine();
