System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Animation, Label, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, DiceAnimationController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Animation = _cc.Animation;
      Label = _cc.Label;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a74a0xFbvJLgLg/7AaanN/b", "dice-animation-controller", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Animation', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 骰子动画控制器
       * 负责管理骰子的动画效果
       */

      _export("DiceAnimationController", DiceAnimationController = (_dec = ccclass('DiceAnimationController'), _dec2 = property([Node]), _dec3 = property([Animation]), _dec4 = property([Label]), _dec5 = property(Animation), _dec(_class = (_class2 = class DiceAnimationController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "diceNodes", _descriptor, this);

          _initializerDefineProperty(this, "diceAnimations", _descriptor2, this);

          _initializerDefineProperty(this, "diceLabels", _descriptor3, this);

          _initializerDefineProperty(this, "shakeAnimation", _descriptor4, this);

          _initializerDefineProperty(this, "animationDuration", _descriptor5, this);
        }

        /**
         * 播放骰子动画
         * @param type 动画类型 'shake' | 'roll'
         * @param options 动画选项
         * @returns Promise
         */
        playAnimation(type, options) {
          switch (type) {
            case 'shake':
              return this.playShakeAnimation();

            case 'roll':
              return this.playRollAnimation((options == null ? void 0 : options.values) || []);

            default:
              return Promise.resolve();
          }
        }
        /**
         * 播放摇骰子动画
         * @returns Promise
         */


        playShakeAnimation() {
          return new Promise(resolve => {
            // 显示所有骰子
            this.diceNodes.forEach(node => {
              if (node) {
                node.active = true;
              }
            }); // 隐藏骰子点数

            this.diceLabels.forEach(label => {
              if (label) {
                label.node.active = false;
              }
            }); // 播放容器的摇动动画

            if (this.shakeAnimation) {
              this.shakeAnimation.play();
            } // 播放每个骰子的动画


            this.diceAnimations.forEach(anim => {
              if (anim) {
                anim.play('dice_roll');
              }
            }); // 动画结束后回调

            setTimeout(() => {
              resolve();
            }, this.animationDuration * 1000);
          });
        }
        /**
         * 播放骰子结果动画
         * @param values 骰子值
         * @returns Promise
         */


        playRollAnimation(values) {
          return new Promise(resolve => {
            // 先隐藏所有骰子
            this.diceNodes.forEach((node, index) => {
              if (node) {
                node.active = index < values.length;
              }
            }); // 显示结果

            for (let i = 0; i < values.length && i < this.diceLabels.length; i++) {
              if (this.diceLabels[i]) {
                this.diceLabels[i].string = values[i].toString();
                this.diceLabels[i].node.active = true;
              }
            } // 停止所有骰子动画


            this.diceAnimations.forEach(anim => {
              if (anim) {
                anim.stop();
              }
            }); // 动画结束后回调

            setTimeout(() => {
              resolve();
            }, 500); // 短暂延迟，让玩家看清骰子结果
          });
        }
        /**
         * 隐藏所有骰子
         */


        hideAllDice() {
          this.diceNodes.forEach(node => {
            if (node) {
              node.active = false;
            }
          });
        }
        /**
         * 显示指定数量的骰子
         * @param count 骰子数量
         */


        showDice(count) {
          this.diceNodes.forEach((node, index) => {
            if (node) {
              node.active = index < count;
            }
          }); // 隐藏骰子点数，等待摇骰子

          this.diceLabels.forEach(label => {
            if (label) {
              label.node.active = false;
            }
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "diceNodes", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "diceAnimations", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "diceLabels", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "shakeAnimation", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "animationDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b1886b63a4d91b06bea17b4c05f20d7577a85a8e.js.map