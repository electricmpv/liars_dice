System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, Animation, SpriteFrame, tween, Vec3, Color, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, DiceItem;

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
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      Animation = _cc.Animation;
      SpriteFrame = _cc.SpriteFrame;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b2c51E6KoxD46H7A8gLEx3Q", "dice-item", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'Animation', 'SpriteFrame', 'math', 'tween', 'Vec3', 'UITransform', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 骰子预制体组件
       * 功能：
       * 1. 显示骰子点数
       * 2. 骰子摇动动画
       * 3. 骰子选中/未选中状态
       */

      _export("DiceItem", DiceItem = (_dec = ccclass('DiceItem'), _dec2 = property(Sprite), _dec3 = property(Label), _dec4 = property(Node), _dec5 = property(Animation), _dec6 = property([SpriteFrame]), _dec7 = property(Sprite), _dec(_class = (_class2 = class DiceItem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "background", _descriptor, this);

          _initializerDefineProperty(this, "valueLabel", _descriptor2, this);

          _initializerDefineProperty(this, "highlightNode", _descriptor3, this);

          _initializerDefineProperty(this, "animation", _descriptor4, this);

          _initializerDefineProperty(this, "diceFaces", _descriptor5, this);

          _initializerDefineProperty(this, "faceSprite", _descriptor6, this);

          this._value = 1;
          this._isSelected = false;
          this._isRolling = false;
          this._originalScale = new Vec3(1, 1, 1);
          this._originalPosition = new Vec3(0, 0, 0);
          // 颜色常量
          this.NORMAL_COLOR = new Color(255, 255, 255, 255);
          this.SELECTED_COLOR = new Color(255, 204, 0, 255);
          this.HIGHLIGHT_COLOR = new Color(66, 133, 244, 255);
        }

        onLoad() {
          this._originalScale = this.node.scale.clone();
          this._originalPosition = this.node.position.clone();
          this.highlightNode.active = false;
        }

        start() {
          // 注册点击事件
          this.node.on(Node.EventType.TOUCH_END, this.onDiceClicked, this);
        }

        onDestroy() {
          this.node.off(Node.EventType.TOUCH_END, this.onDiceClicked, this);
        }
        /**
         * 设置骰子的值
         * @param value 骰子点数 (1-6)
         */


        setValue(value) {
          if (value < 1 || value > 6) {
            console.error('骰子值必须在1到6之间');
            return;
          }

          this._value = value;
          this.updateDisplay();
        }
        /**
         * 获取骰子当前值
         */


        getValue() {
          return this._value;
        }
        /**
         * 设置骰子选中状态
         * @param selected 是否选中
         */


        setSelected(selected) {
          this._isSelected = selected;
          this.updateDisplay();
        }
        /**
         * 获取骰子当前选中状态
         */


        isSelected() {
          return this._isSelected;
        }
        /**
         * 更新骰子显示
         */


        updateDisplay() {
          // 更新骰子面显示
          if (this.diceFaces && this.diceFaces.length >= 6) {
            this.faceSprite.spriteFrame = this.diceFaces[this._value - 1];
          } // 更新数字标签


          if (this.valueLabel) {
            this.valueLabel.string = this._value.toString();
          } // 更新选中状态


          if (this.highlightNode) {
            this.highlightNode.active = this._isSelected;
          } // 更新颜色


          if (this.background) {
            this.background.color = this._isSelected ? this.SELECTED_COLOR : this.NORMAL_COLOR;
          }
        }
        /**
         * 骰子点击事件处理
         */


        onDiceClicked() {
          if (this._isRolling) return; // 切换选中状态

          this._isSelected = !this._isSelected;
          this.updateDisplay(); // 播放点击反馈动画

          this.playClickFeedback(); // 触发选中事件

          this.node.emit('dice-selected', {
            diceId: this.node.uuid,
            value: this._value,
            selected: this._isSelected
          });
        }
        /**
         * 播放点击反馈动画
         */


        playClickFeedback() {
          // 缩放动画
          tween(this.node).to(0.1, {
            scale: new Vec3(this._originalScale.x * 0.9, this._originalScale.y * 0.9, 1)
          }).to(0.1, {
            scale: this._originalScale
          }).start();
        }
        /**
         * 播放骰子摇动动画
         * @param duration 动画持续时间
         * @param callback 动画结束回调
         */


        playRollAnimation(duration = 1.0, callback) {
          if (this._isRolling) return;
          this._isRolling = true; // 保存原始状态

          const originalValue = this._value;
          const originalSelected = this._isSelected; // 重置选中状态

          this.setSelected(false); // 创建摇动动画序列

          const rollSequence = () => {
            const shakeOffset = 8;
            const shakeTime = 0.05;
            const shakeCount = Math.floor(duration / shakeTime / 2);
            const shakeTween = tween(this.node); // 添加多次摇动

            for (let i = 0; i < shakeCount; i++) {
              // 随机方向摇动
              const xOffset = (Math.random() - 0.5) * 2 * shakeOffset;
              const yOffset = (Math.random() - 0.5) * 2 * shakeOffset;
              shakeTween.to(shakeTime, {
                position: new Vec3(this._originalPosition.x + xOffset, this._originalPosition.y + yOffset, this._originalPosition.z)
              }); // 随机骰子值

              shakeTween.call(() => {
                const randomValue = Math.floor(Math.random() * 6) + 1;
                this.setValue(randomValue);
              });
            } // 回到原始位置


            shakeTween.to(shakeTime, {
              position: this._originalPosition
            });
            return shakeTween;
          }; // 执行动画


          tween(this.node).to(0.15, {
            scale: new Vec3(this._originalScale.x * 1.2, this._originalScale.y * 1.2, 1)
          }).to(0.15, {
            scale: this._originalScale
          }).then(rollSequence()).call(() => {
            this._isRolling = false; // 如果有提供回调，则调用

            if (callback) {
              callback(this._value);
            }
          }).start();
        }
        /**
         * 设置最终骰子值并播放动画
         * @param finalValue 最终的骰子值 (1-6)
         * @param duration 动画持续时间
         * @param callback 动画结束回调
         */


        rollToValue(finalValue, duration = 1.0, callback) {
          if (finalValue < 1 || finalValue > 6) {
            console.error('骰子值必须在1到6之间');
            return;
          }

          this.playRollAnimation(duration, () => {
            this.setValue(finalValue);

            if (callback) {
              callback(finalValue);
            }
          });
        }
        /**
         * 播放高亮动画
         * @param duration 高亮持续时间
         */


        playHighlightAnimation(duration = 0.5) {
          // 显示高亮节点
          this.highlightNode.active = true; // 创建呼吸效果

          tween(this.highlightNode).to(duration / 2, {
            scale: new Vec3(1.2, 1.2, 1)
          }).to(duration / 2, {
            scale: new Vec3(1, 1, 1)
          }).union().repeat(3).call(() => {
            // 结束后设置为当前选中状态
            this.highlightNode.active = this._isSelected;
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "background", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "valueLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "highlightNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "animation", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "diceFaces", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "faceSprite", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c13226e23edd9b6de93804133563937fcf66a307.js.map