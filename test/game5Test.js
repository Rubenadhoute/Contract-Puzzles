const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    let exit = false;
    const signer = ethers.provider.getSigner(0);
    const value = ethers.utils.parseEther('1.0');
    let count = 0;

    while (!exit) {
      try {
        count++;
        // wallet created randomly with hardhat provider
        const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
        const to = wallet.address;
        // we need eth to make a transaction
        await signer.sendTransaction({ to, value });
        await game.connect(wallet).win();

        console.log(`winner address: ${to}`);
        console.log(`wallet number ${count}`);

        exit = true;
      } catch (error) {}
    }
    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
