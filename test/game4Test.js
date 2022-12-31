const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    // nested mappings are rough :}
    const signerX = ethers.provider.getSigner(0);
    const signerY = ethers.provider.getSigner(1);

    const addressX = await signerX.getAddress();
    const addressY = await signerY.getAddress();

    await game.connect(signerY).write(addressX);
    // write(address x) --> nested[x][msg.sender]
    // connect(signerY).write(addressX) --> nested[addressX][signerY]


    // win(address y) --> require(nested[msg.sender][y])
    await game.win(addressY);
    // equivalent to await game.connect(signerX).win(addressY);



    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
