/*
// 直接运行测试的方式
import { Game } from '../src/modules/game/game';
import { Player } from '../src/modules/player/player';
import { Bid, Face } from '../../shared/protocols/game-types.d';

/**
 * 游戏逻辑单元测试
 */
/*
console.log('======= 开始游戏核心逻辑测试 =======');

// 测试游戏实例
let game: Game;

// 测试玩家
let player1: Player;
let player2: Player;
let player3: Player;

/**
 * 测试前准备工作
 */
/*
function setup() {
  // 创建玩家
  player1 = new Player('player1', '玩家1');
  player2 = new Player('player2', '玩家2');
  player3 = new Player('player3', '玩家3');
  
  // 创建游戏
  game = new Game('game1');
  
  // 添加玩家
  game.addPlayer(player1);
  game.addPlayer(player2);
  game.addPlayer(player3);
  
  // 开始游戏
  game.start();
}

/**
 * 测试游戏初始化
 */
/*
function testGameInitialization() {
  console.log('测试游戏初始化...');
  
  // 设置测试环境
  setup();
  
  // 执行断言
  console.assert(game.id === 'game1', '游戏ID不匹配');
  console.assert(game.players.length === 3, '玩家数量不匹配');
  console.assert(game.currentPlayerIndex === 0, '当前玩家索引不匹配');
  console.assert(game.status === 'playing', '游戏状态不匹配');
  
  // 检查每个玩家的骰子数量
  game.players.forEach((player: Player) => {
    console.assert(player.diceCount === 5, `玩家 ${player.name} 的骰子数量不匹配`);
  });
  
  console.log('测试游戏初始化 - 成功');
}

/**
 * 测试竞价逻辑
 */
/*
function testBidding() {
  console.log('测试竞价逻辑...');
  
  // 设置测试环境
  setup();
  
  // 初始竞价
  const initialBid: Bid = [2 as Face, 2];
  
  // 玩家1下注
  const bidResult = game.placeBid(player1.id, initialBid);
  
  // 验证结果
  console.assert(bidResult.success === true, '竞价应该成功');
  console.assert(game.currentBid![0] === initialBid[0] && game.currentBid![1] === initialBid[1], '当前竞价不匹配');
  console.assert(game.currentPlayerIndex === 1, '当前玩家应该是下一个玩家');
  
  // 玩家2加注
  const higherBid: Bid = [2 as Face, 3];
  const bidResult2 = game.placeBid(player2.id, higherBid);
  
  // 验证结果
  console.assert(bidResult2.success === true, '加注应该成功');
  console.assert(game.currentBid![0] === higherBid[0] && game.currentBid![1] === higherBid[1], '当前竞价不匹配');
  console.assert(game.currentPlayerIndex === 2, '当前玩家应该是下一个玩家');
  
  console.log('测试竞价逻辑 - 成功');
}

/**
 * 测试无效竞价
 */
/*
function testInvalidBid() {
  console.log('测试无效竞价...');
  
  // 设置测试环境
  setup();
  
  // 初始竞价
  const initialBid: Bid = [2 as Face, 2];
  game.placeBid(player1.id, initialBid);
  
  // 尝试一个比当前竞价低的竞价
  const lowerBid: Bid = [2 as Face, 1];
  const bidResult = game.placeBid(player2.id, lowerBid);
  
  // 验证结果
  console.assert(bidResult.success === false, '无效竞价应该被拒绝');
  console.assert(bidResult.error !== undefined, '应该返回错误信息');
  console.assert(game.currentBid![0] === initialBid[0] && game.currentBid![1] === initialBid[1], '竞价不应该改变');
  console.assert(game.currentPlayerIndex === 1, '玩家索引不应该改变');
  
  console.log('测试无效竞价 - 成功');
}

/**
 * 测试质疑逻辑
 */
/*
function testChallenge() {
  console.log('测试质疑逻辑...');
  
  // 设置测试环境
  setup();
  
  // 设置一个已知的骰子分布
  player1.dices = [1 as Face, 2 as Face, 2 as Face, 3 as Face, 4 as Face];
  player2.dices = [2 as Face, 2 as Face, 5 as Face, 6 as Face, 6 as Face];
  player3.dices = [1 as Face, 3 as Face, 4 as Face, 5 as Face, 5 as Face];
  
  // 玩家1竞价：3个2
  const bid: Bid = [2 as Face, 3];
  game.placeBid(player1.id, bid);
  
  // 玩家2质疑
  const challengeResult = game.challenge(player2.id);
  
  // 实际有4个2，所以质疑失败，玩家2应该失去一个骰子
  console.assert(challengeResult.success === true, '质疑应该成功处理');
  console.assert(challengeResult.valid === false, '质疑应该失败（实际有足够的骰子）');
  console.assert(challengeResult.totalCount === 4, '应该正确计算实际的骰子数量');
  console.assert(player2.diceCount === 4, '玩家2应该失去一个骰子');
  
  console.log('测试质疑逻辑 - 成功');
}

/**
 * 测试即时喊逻辑
 */
/*
function testSpotOn() {
  console.log('测试即时喊逻辑...');
  
  // 设置测试环境
  setup();
  
  // 设置一个已知的骰子分布
  player1.dices = [1 as Face, 2 as Face, 2 as Face, 3 as Face, 4 as Face];
  player2.dices = [2 as Face, 2 as Face, 5 as Face, 6 as Face, 6 as Face];
  player3.dices = [1 as Face, 3 as Face, 4 as Face, 5 as Face, 5 as Face];
  
  // 玩家1竞价：4个2
  const bid: Bid = [2 as Face, 4];
  game.placeBid(player1.id, bid);
  
  // 玩家2即时喊
  const spotOnResult = game.spotOn(player2.id);
  
  // 实际有4个2，所以即时喊正确，玩家2应该获得一个骰子
  console.assert(spotOnResult.success === true, '即时喊应该成功处理');
  console.assert(spotOnResult.valid === true, '即时喊应该正确（实际骰子数量与竞价一致）');
  console.assert(spotOnResult.totalCount === 4, '应该正确计算实际的骰子数量');
  console.assert(player2.diceCount === 6, '玩家2应该获得一个骰子');
  
  console.log('测试即时喊逻辑 - 成功');
}

/**
 * 测试游戏结束逻辑
 */
/*
function testGameOver() {
  console.log('\n测试游戏结束逻辑...');
  
  // 设置测试环境
  game = new Game('test-game');
  player1 = new Player('player1', '玩家1', 5);
  player2 = new Player('player2', '玩家2', 1);
  game.addPlayer(player1);
  game.addPlayer(player2);
  game.start();
  
  // 设置已知的骰子分布
  player1.dices = [1 as Face, 2 as Face, 3 as Face, 4 as Face, 5 as Face];
  player2.dices = [6 as Face];
  
  // 玩家1竞价：3个6
  const bid: Bid = [6 as Face, 3];
  game.placeBid(player1.id, bid);
  
  // 玩家2质疑 - 由于实际只有1个6，玩家2的质疑是正确的，玩家1会输掉一个骰子
  const challengeResult = game.challenge(player2.id);
  
  // 验证结果
  console.assert(player1.diceCount === 4, '玩家1应该失去一个骰子');
  console.assert(player2.diceCount === 1, '玩家2应该保持骰子数量');
  console.assert(game.status === 'playing', '游戏应该继续');
  
  // 下一轮竞价
  const secondBid: Bid = [3 as Face, 2];
  game.placeBid(player2.id, secondBid);
  
  // 玩家1质疑失败，应该失去一个骰子
  player1.dices = [1 as Face, 3 as Face, 3 as Face, 5 as Face];
  player2.dices = [3 as Face];
  
  const secondChallengeResult = game.challenge(player1.id);
  
  // 验证玩家1失去一个骰子
  console.assert(player1.diceCount === 3, '玩家1应该再失去一个骰子');
  console.assert(player2.diceCount === 1, '玩家2应该保持骰子数量');
  
  // 设置第三轮
  const thirdBid: Bid = [4 as Face, 1];
  game.placeBid(player2.id, thirdBid);
  
  // 设置玩家1的骰子，确保没有4
  player1.dices = [1 as Face, 2 as Face, 3 as Face];
  // 设置玩家2的骰子，确保没有4
  player2.dices = [5 as Face];
  
  // 玩家1质疑成功，玩家2应该失去最后一个骰子，游戏结束
  const finalChallengeResult = game.challenge(player1.id);
  
  console.log('游戏结束测试 - 最终状态:');
  console.log('- 玩家1骰子:', player1.diceCount);
  console.log('- 玩家2骰子:', player2.diceCount);
  console.log('- 活跃玩家:', game.activePlayers);
  console.log('- 游戏状态:', game.status);
  console.log('- 获胜者:', game.winner);
  console.log('- 游戏结束标志:', finalChallengeResult.gameOver);
  
  // 验证游戏结束，玩家1获胜
  console.assert(finalChallengeResult.gameOver === true, '游戏应该结束');
  console.assert(player2.diceCount === 0, '玩家2应该失去所有骰子');
  console.assert(game.activePlayers.length === 1, '应该只剩一个活跃玩家');
  console.assert(game.activePlayers[0] === player1.id, '活跃玩家应该是玩家1');
  console.assert(game.status === 'finished', '游戏状态应该是完成');
  console.assert(game.winner === player1.id, '玩家1应该获胜');
  
  console.log('测试游戏结束逻辑 - 成功');
}

// 运行所有测试
testGameInitialization();
testBidding();
testInvalidBid();
testChallenge();
testSpotOn();
testGameOver();

console.log('======= 游戏核心逻辑测试完成 =======');
*/
