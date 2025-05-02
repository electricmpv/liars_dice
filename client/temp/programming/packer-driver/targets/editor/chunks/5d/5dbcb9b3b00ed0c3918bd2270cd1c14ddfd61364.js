System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Animation, Label, CCInteger, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, GameEngine;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Animation = _cc.Animation;
      Label = _cc.Label;
      CCInteger = _cc.CCInteger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "26cb7PgYc1KtY5jSj+jCJE2", "game-engine", undefined);

      // 移除了大部分导入，特别是与核心游戏逻辑和类型相关的
      // import { Face, Hand, Bid, EmptyBid, PlayerID, BidData, DiceResult, EventEmitter } from '../../shared/protocols/game-types.d';
      // import { network } from './network'; // 移除网络依赖，UI层处理
      __checkObsolete__(['_decorator', 'Component', 'Node', 'Animation', 'Label', 'CCInteger']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * GameEngine (已简化)
       * 注意：此类中的大部分核心游戏逻辑已被移除，因为服务器是权威。
       * 此文件可能需要进一步重构或删除，具体取决于项目需求。
       * 目前保留了与潜在动画相关的属性和方法框架。
       */

      _export("GameEngine", GameEngine = (_dec = ccclass('GameEngine'), _dec2 = property({
        type: CCInteger
      }), _dec3 = property(Node), _dec4 = property(Animation), _dec(_class = (_class2 = class GameEngine extends Component {
        constructor(...args) {
          super(...args);

          // --- 保留与动画/视觉效果可能相关的属性 ---
          _initializerDefineProperty(this, "animationDuration", _descriptor, this);

          // 动画持续时间示例
          _initializerDefineProperty(this, "diceContainer", _descriptor2, this);

          // 骰子容器引用示例
          _initializerDefineProperty(this, "shakeAnimation", _descriptor3, this);

          // 摇动动画引用示例
          // --- 移除了游戏状态相关的属性 ---
          // public readonly gameId: string;
          // public roundNumber: number = 0;
          // public moveNumber: number = 0;
          // private players: Player[] = []; // 移除 Player 类和实例
          // private activePlayers: PlayerID[] = [];
          // private currentBid: GameBid = new GameBid(); // 移除 GameBid 类和实例
          // private currentPlayerIndex: number = 0;
          // private serverSeed: string = '';
          // --- 移除了事件发射器 ---
          // public onBidSubmitted = new SimpleEventEmitter<BidData>();
          // ... 其他事件
          // --- 保留与节点/动画初始化和控制相关的方法框架 ---
          this.diceNodes = [];
          this.diceAnimations = [];
          this.diceLabels = [];
        }

        /**
         * 组件启动时
         */
        start() {
          // this.initDiceNodes(); // 如果需要初始化骰子节点
          // this.setupNetworkListeners(); // 移除网络监听，由 UI 层处理
          console.warn("GameEngine component started, but most core logic is removed/handled by the server and GameUI.");
        }
        /**
         * 初始化骰子节点 (示例，如果需要)
         */


        initDiceNodes() {
          if (!this.diceContainer) return;
          this.diceNodes = [];
          this.diceAnimations = [];
          this.diceLabels = [];
          this.diceContainer.children.forEach(diceNode => {
            this.diceNodes.push(diceNode);
            const anim = diceNode.getComponent(Animation);
            if (anim) this.diceAnimations.push(anim);
            const label = diceNode.getComponentInChildren(Label);
            if (label) this.diceLabels.push(label);
          });
          console.log("Dice nodes initialized (if container is set).");
        }
        /**
         * 播放摇骰子动画 (示例，如果需要)
         */


        playShakeAnimation() {
          if (this.shakeAnimation) {
            this.shakeAnimation.play();
            console.log("Playing shake animation (if set).");
          } else {
            console.warn("Shake animation node not set in GameEngine.");
          } // 播放每个骰子的动画 (示例)


          this.diceAnimations.forEach(anim => {
            if (anim) {// anim.play('dice_roll'); // 假设有 'dice_roll' 动画剪辑
            }
          });
        }
        /**
         * 显示骰子结果 (示例，如果需要独立于 GameUI 控制)
         * @param results 骰子结果 (Face[])
         */


        showDiceResult(results) {
          // 使用 number[] 简化，避免依赖 Face 类型
          if (!this.diceContainer) {
            console.warn("Dice container not set in GameEngine, cannot show results.");
            return;
          }

          console.log("GameEngine attempting to show dice results:", results); // 先隐藏所有骰子

          this.diceNodes.forEach((node, index) => {
            node.active = index < results.length;
          }); // 显示结果

          for (let i = 0; i < results.length && i < this.diceLabels.length; i++) {
            if (this.diceLabels[i]) {
              this.diceLabels[i].string = results[i].toString();
            }
          }
        } // --- 移除了所有核心游戏逻辑方法 ---
        // setupNetworkListeners()
        // handleChallengeResult()
        // rollDices()
        // syncWithServer()
        // getCurrentPlayer()
        // checkBidValidity()
        // nextTurn()
        // startNewRound()
        // placeBid()
        // challengeBid()
        // handlePlayerLoss()
        // public static rollDices() // 移除了静态方法


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "animationDuration", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "diceContainer", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "shakeAnimation", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class)); // --- 移除了 Player 和 GameBid 类定义 ---
      // class Player { ... }
      // class GameBid { ... }
      // class SimpleEventEmitter { ... } // 如果其他地方不用，也移除


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5dbcb9b3b00ed0c3918bd2270cd1c14ddfd61364.js.map