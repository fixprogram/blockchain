const SHA256 = require("crypto-js/sha256"); // This is the module we’ve imported to calculate the hash of each block.

class BlockCrypto {
  constructor(index, current_time, info, nextHash = " ") {
    this.index = index; // This is a distinctive number tracking the index of every block in the blockchain.
    this.current_time = current_time; // As the name states, it keeps a record of the time when each transaction is completed.
    this.info = info; // All completed transactions data are recorded and stored by this method.
    this.nextHash = nextHash; // It is pointing to the hash_key of the next block in the network chain. It’s mainly used to keep and maintain the integrity of the blockchain.
    this.hash = this.computeHash();
  }
  computeHash() {
    // Based on properties passed to this method, it is used to calculate the hashkey of the next block in the chain.
    return SHA256(
      this.info + this.nextHash + this.current_time + JSON.stringify(this.info)
    ).toString(); // We converted it to string using toString() method as the module will return the object.
  }
}

class Blockchain {
  constructor() {
    this.blockchain = [this.initGenesisBlock()];
  }

  initGenesisBlock() {
    // This is the first block created in the peer-to-peer network and has not been linked to any other. To our knowledge of indexing it’s at index 0.
    return new BlockCrypto(0, "09/01/2021", "Initial block in the chain", "0");
  }

  latestBlock() {
    // As named, we use it for finding the last block added in the chain. As explained earlier, it helps to ensure the hash of the current block and map it to the hash of the previous block to ensure the chain integrity.
    return this.blockchain[this.blockchain.length - 1];
  }

  addNewBlock(newBlock) {
    // A new block is added to the chain using this method. The previous hash block is matched to the current hash block to ensure minimal or no tampering with the chain.
    newBlock.nextHash = this.latestBlock().hash;
    newBlock.hash = newBlock.computeHash();
    this.blockchain.push(newBlock);
  }

  checkValidity() {
    // Checking validity

    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const nextBlock = this.blockchain[i - 1];

      // Checking current block hash

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }

      // Comparing current block hash with the next block

      if (currentBlock.nextHash !== nextBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

// Now, we can test our app and see the results:

// But, before we dive into running the code, let’s create a new instance of the Blockchain class and name it thecoin,
// and add some blocks in the blockchain using random values.

let thecoin = new Blockchain();

thecoin.addNewBlock(
  new BlockCrypto(1, "01/09/2021", {
    sender: "Dennis",
    recipient: "Sanya",
    quantity: 20,
  })
);
thecoin.addNewBlock(
  new BlockCrypto(2, "02/09/2021", {
    sender: "Sanya",
    recipient: "Dennis",
    quantity: 370,
  })
);

console.log(JSON.stringify(thecoin, null, 4));
