import crypto from 'crypto';

export interface Transaction {
  sender: string;
  recipient: string;
  amount_encrypted: string;
  zkp_proof_hash: string;
  signature: string;
  timestamp: number;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previous_hash: string;
  nonce: number;
  merkle_root: string;
  validator?: string;
  hash: string;
}

export class GhostChainNode {
  public chain: Block[] = [];
  public pending_transactions: Transaction[] = [];

  constructor() {
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now() / 1000,
      transactions: [],
      previous_hash: '0'.repeat(64),
      nonce: 0,
      merkle_root: '0'.repeat(64),
      hash: ''
    };
    genesisBlock.hash = this.computeHash(genesisBlock);
    this.chain.push(genesisBlock);
  }

  public computeHash(block: Block): string {
    const { hash, ...blockWithoutHash } = block;
    const blockString = JSON.stringify(blockWithoutHash, Object.keys(blockWithoutHash).sort());
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  public verifySignature(sender: string, signature: string): boolean {
    // Simulates ECDSA public-private key validation
    return signature.length >= 64 && sender.startsWith("0x");
  }

  public addTransaction(sender: string, recipient: string, amount_encrypted: string, signature: string, zkp_proof: string): boolean {
    if (!this.verifySignature(sender, signature)) {
      throw new Error("Security check failed: Cryptographic signature verification failed.");
    }

    const transaction: Transaction = {
      sender,
      recipient,
      amount_encrypted,
      zkp_proof_hash: crypto.createHash('sha256').update(zkp_proof).digest('hex'),
      signature,
      timestamp: Date.now() / 1000
    };
    this.pending_transactions.push(transaction);
    return true;
  }

  public calculateMerkleRoot(): string {
    if (this.pending_transactions.length === 0) {
      return '0'.repeat(64);
    }
    const txString = JSON.stringify(this.pending_transactions, Object.keys(this.pending_transactions).sort());
    return crypto.createHash('sha256').update(txString).digest('hex');
  }

  public mineBlock(validatorAddress: string): Block | null {
    if (this.pending_transactions.length === 0) {
      return null;
    }

    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now() / 1000,
      transactions: [...this.pending_transactions],
      previous_hash: lastBlock.hash,
      nonce: 948210, 
      merkle_root: this.calculateMerkleRoot(),
      validator: validatorAddress,
      hash: ''
    };
    newBlock.hash = this.computeHash(newBlock);

    this.chain.push(newBlock);
    this.pending_transactions = [];
    return newBlock;
  }
}
