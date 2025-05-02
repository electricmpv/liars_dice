System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, SpriteFrame, Color, tween, Vec3, UIOpacity, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, PlayerItem;

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
      SpriteFrame = _cc.SpriteFrame;
      Color = _cc.Color;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "60aceiUONNEK71p+5KV4BFl", "player-item", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'SpriteFrame', 'UITransform', 'Color', 'tween', 'Vec3', 'sys', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 玩家列表项预制体
       * 功能：
       * 1. 显示玩家头像、名称、状态
       * 2. 当前玩家/轮到玩家高亮显示
       * 3. 支持玩家状态变化动画
       */

      _export("PlayerItem", PlayerItem = (_dec = ccclass('PlayerItem'), _dec2 = property(Sprite), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(SpriteFrame), _dec8 = property([SpriteFrame]), _dec9 = property(Node), _dec(_class = (_class2 = class PlayerItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "avatar", _descriptor, this);

          _initializerDefineProperty(this, "nameLabel", _descriptor2, this);

          _initializerDefineProperty(this, "statusLabel", _descriptor3, this);

          // Removed currentPlayerIndicator property
          _initializerDefineProperty(this, "readyIndicator", _descriptor4, this);

          // Removed activeIndicator property
          _initializerDefineProperty(this, "offlineIndicator", _descriptor5, this);

          // Removed diceContainer property
          // Removed diceCountLabel property
          _initializerDefineProperty(this, "defaultAvatar", _descriptor6, this);

          _initializerDefineProperty(this, "aiAvatars", _descriptor7, this);

          _initializerDefineProperty(this, "aiIcon", _descriptor8, this);

          // 新增：用于显示 AI 图标的节点
          this._playerId = '';
          this._playerName = '';
          // Removed _isCurrentPlayer state
          // Removed _isActivePlayer state
          this._isReady = false;
          this._isOnline = true;
          this._isAI = false;
          this._aiType = -1;
          // Removed _diceCount state
          this._originalScale = new Vec3(1, 1, 1);
          // 颜色常量
          this.ACTIVE_COLOR = new Color(255, 204, 0, 255);
          this.INACTIVE_COLOR = new Color(255, 255, 255, 255);
          this.OFFLINE_COLOR = new Color(150, 150, 150, 255);
        }

        onLoad() {
          this._originalScale = this.node.scale.clone();
          this.updateIndicators();
        }

        start() {
          this.node.on(Node.EventType.TOUCH_END, this.onPlayerItemClicked, this);
        }

        onDestroy() {
          this.node.off(Node.EventType.TOUCH_END, this.onPlayerItemClicked, this);
        }
        /**
         * 设置玩家ID
         */


        setPlayerId(id) {
          this._playerId = id;
        }
        /**
         * 获取玩家ID
         */


        getPlayerId() {
          return this._playerId;
        }
        /**
         * 设置玩家名称
         */


        setPlayerName(name) {
          this._playerName = name;

          if (this.nameLabel) {
            this.nameLabel.string = name;
          }
        }
        /**
         * 获取玩家名称
         */


        getPlayerName() {
          return this._playerName;
        }
        /**
         * 设置玩家头像
         */


        setAvatar(spriteFrame) {
          if (this.avatar && spriteFrame) {
            this.avatar.spriteFrame = spriteFrame;
          }
        }
        /**
         * 设置是否为AI玩家
         */


        setIsAI(isAI, aiType) {
          if (aiType === void 0) {
            aiType = 0;
          }

          this._isAI = isAI;
          this._aiType = aiType; // 如果是AI，设置AI头像

          if (isAI && this.aiAvatars && this.aiAvatars.length > 0) {
            var avatarIndex = aiType % this.aiAvatars.length;
            this.setAvatar(this.aiAvatars[avatarIndex]);
          } else if (this.defaultAvatar) {
            // 否则设置默认头像
            this.setAvatar(this.defaultAvatar);
          } // 控制 AI 图标的显隐


          if (this.aiIcon) {
            this.aiIcon.active = isAI;
          }

          this.updateStatusLabel();
        } // Removed setIsCurrentPlayer method
        // Removed setIsActivePlayer method

        /**
         * 设置玩家准备状态
         */


        setIsReady(isReady) {
          // 如果状态发生变化
          if (this._isReady !== isReady) {
            if (isReady) {
              this.playReadyAnimation();
            }
          }

          this._isReady = isReady;
          this.updateIndicators();
          this.updateStatusLabel();
        }
        /**
         * 设置玩家在线状态
         */


        setIsOnline(isOnline) {
          // 如果状态从在线变为离线
          if (this._isOnline && !isOnline) {
            this.playOfflineAnimation();
          } else if (!this._isOnline && isOnline) {
            // 如果状态从离线变为在线
            this.playOnlineAnimation();
          }

          this._isOnline = isOnline;
          this.updateIndicators();
          this.updateStatusLabel();
        } // Removed setDiceCount method

        /**
         * 更新状态标签
         */


        updateStatusLabel() {
          if (!this.statusLabel) return;

          if (!this._isOnline) {
            this.statusLabel.string = '离线';
            this.statusLabel.color = this.OFFLINE_COLOR;
          } else if (this._isAI) {
            this.statusLabel.string = 'AI玩家';
            this.statusLabel.color = new Color(66, 133, 244, 255);
          } else if (this._isReady) {
            this.statusLabel.string = '已准备';
            this.statusLabel.color = new Color(76, 217, 100, 255);
          } else {
            this.statusLabel.string = '未准备';
            this.statusLabel.color = new Color(255, 59, 48, 255);
          }
        }
        /**
         * 更新指示器状态
         */


        updateIndicators() {
          // 当前玩家指示器 (Removed)
          // if (this.currentPlayerIndicator) {
          //     this.currentPlayerIndicator.active = this._isCurrentPlayer;
          // }
          // 准备指示器
          if (this.readyIndicator) {
            this.readyIndicator.active = this._isReady && this._isOnline;
          } // 活跃玩家指示器 (Removed)
          // if (this.activeIndicator) {
          //     this.activeIndicator.active = this._isActivePlayer && this._isOnline;
          // }
          // 离线指示器


          if (this.offlineIndicator) {
            this.offlineIndicator.active = !this._isOnline;
          } // 更新颜色


          if (this.avatar) {
            if (!this._isOnline) {
              this.avatar.color = this.OFFLINE_COLOR; // Removed active player color logic
              // } else if (this._isActivePlayer) {
              //     this.avatar.color = this.ACTIVE_COLOR;
            } else {
              this.avatar.color = this.INACTIVE_COLOR;
            }
          }
        }
        /**
         * 玩家项被点击的事件处理
         */


        onPlayerItemClicked() {
          // 播放点击反馈动画
          this.playClickFeedback(); // 发出玩家被点击的事件

          this.node.emit('player-clicked', {
            playerId: this._playerId,
            playerName: this._playerName,
            isAI: this._isAI // Removed isCurrentPlayer from event data

          });
        }
        /**
         * 播放点击反馈动画
         */


        playClickFeedback() {
          tween(this.node).to(0.1, {
            scale: new Vec3(this._originalScale.x * 0.95, this._originalScale.y * 0.95, 1)
          }).to(0.1, {
            scale: this._originalScale
          }).start();
        }
        /**
         * 播放激活动画（轮到该玩家操作） (Removed)
         */
        // private playActivateAnimation(): void { ... }

        /**
         * 播放准备动画
         */


        playReadyAnimation() {
          if (!this._isOnline) return; // 显示准备指示器

          if (this.readyIndicator) {
            this.readyIndicator.active = true;
            this.readyIndicator.scale = new Vec3(0, 0, 1); // 缩放动画

            tween(this.readyIndicator).to(0.3, {
              scale: new Vec3(1.2, 1.2, 1)
            }).to(0.2, {
              scale: new Vec3(1, 1, 1)
            }).start();
          }
        }
        /**
         * 播放离线动画
         */


        playOfflineAnimation() {
          // 灰度动画
          if (this.avatar) {
            tween(this.avatar).to(0.5, {
              color: this.OFFLINE_COLOR
            }).start();
          } // 显示离线指示器


          if (this.offlineIndicator) {
            this.offlineIndicator.active = true;
            var uiOpacity = this.offlineIndicator.getComponent(UIOpacity) || this.offlineIndicator.addComponent(UIOpacity);
            uiOpacity.opacity = 0;
            tween(uiOpacity).to(0.5, {
              opacity: 255
            }).start();
          }
        }
        /**
         * 播放上线动画
         */


        playOnlineAnimation() {
          // 恢复颜色
          if (this.avatar) {
            tween(this.avatar).to(0.5, {
              // Removed active player color logic
              color: this.INACTIVE_COLOR
            }).start();
          } // 隐藏离线指示器


          if (this.offlineIndicator) {
            var uiOpacity = this.offlineIndicator.getComponent(UIOpacity) || this.offlineIndicator.addComponent(UIOpacity);
            tween(uiOpacity).to(0.5, {
              opacity: 0
            }).call(() => {
              this.offlineIndicator.active = false;
            }).start();
          }
        }
        /**
         * 播放骰子减少动画 (Removed)
         */
        // private playDiceReduceAnimation(count: number): void { ... }


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "avatar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nameLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "readyIndicator", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "offlineIndicator", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "defaultAvatar", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "aiAvatars", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "aiIcon", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=66ffa386cc7bc2acd1b41049ff811dfde94e564f.js.map