System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, Button, Color, tween, Vec3, UIOpacity, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, RoomItem;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSharedRoomStatus(extras) {
    _reporterNs.report("SharedRoomStatus", "../../../../shared/protocols/room-protocol", _context.meta, extras);
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
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      Button = _cc.Button;
      Color = _cc.Color;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6ba34jB4IxF2ZfmzWkeGXfS", "room-item", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'Button', 'Color', 'tween', 'Vec3', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 房间列表项预制体
       * 功能：
       * 1. 显示房间信息（ID、名称、玩家数、状态）
       * 2. 支持点击加入房间
       * 3. 根据房间状态显示不同样式
       */

      _export("RoomItem", RoomItem = (_dec = ccclass('RoomItem'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Sprite), _dec7 = property(Button), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec(_class = (_class2 = class RoomItem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "roomIdLabel", _descriptor, this);

          _initializerDefineProperty(this, "roomNameLabel", _descriptor2, this);

          _initializerDefineProperty(this, "playerCountLabel", _descriptor3, this);

          _initializerDefineProperty(this, "statusLabel", _descriptor4, this);

          _initializerDefineProperty(this, "backgroundSprite", _descriptor5, this);

          _initializerDefineProperty(this, "joinButton", _descriptor6, this);

          _initializerDefineProperty(this, "lockedIcon", _descriptor7, this);

          _initializerDefineProperty(this, "privateIcon", _descriptor8, this);

          _initializerDefineProperty(this, "playingIcon", _descriptor9, this);

          _initializerDefineProperty(this, "friendsIcon", _descriptor10, this);

          // 房间信息
          this._roomId = '';
          this._roomName = '';
          this._playerCount = 0;
          this._maxPlayers = 6;
          this._status = "waiting";
          this._hasPassword = false;
          this._isPrivate = false;
          this._hasFriends = false;
          this._originalScale = new Vec3(1, 1, 1);
          // 颜色常量
          this.WAITING_COLOR = new Color(76, 217, 100, 255);
          this.PLAYING_COLOR = new Color(255, 59, 48, 255);
          this.FULL_COLOR = new Color(142, 142, 147, 255);
        }

        onLoad() {
          this._originalScale = this.node.scale.clone();
          this.updateRoomDisplay();
        }

        start() {
          // 注册点击事件
          this.node.on(Node.EventType.TOUCH_END, this.onRoomItemClicked, this);

          if (this.joinButton) {
            this.joinButton.node.on('click', this.onJoinButtonClicked, this);
          }
        }

        onDestroy() {
          // 在移除监听器前检查节点是否有效，避免在销毁阶段访问无效节点
          if (this.node && this.node.isValid) {
            this.node.off(Node.EventType.TOUCH_END, this.onRoomItemClicked, this);
          }

          if (this.joinButton && this.joinButton.isValid && this.joinButton.node && this.joinButton.node.isValid) {
            this.joinButton.node.off('click', this.onJoinButtonClicked, this);
          }
        }
        /**
         * 设置房间信息
         */


        setRoomInfo(info) {
          this._roomId = info.roomId;
          this._roomName = info.roomName;
          this._playerCount = info.playerCount;
          this._maxPlayers = info.maxPlayers;
          this._status = info.status;
          this._hasPassword = info.hasPassword;
          this._isPrivate = info.isPrivate;
          this._hasFriends = info.hasFriends;
          this.updateRoomDisplay();
        }
        /**
         * 设置房间ID
         */


        setRoomId(id) {
          this._roomId = id;

          if (this.roomIdLabel) {
            this.roomIdLabel.string = `#${id}`;
          }
        }
        /**
         * 设置房间名称
         */


        setRoomName(name) {
          this._roomName = name;

          if (this.roomNameLabel) {
            this.roomNameLabel.string = name;
          }
        }
        /**
         * 设置房间玩家数量
         */


        setPlayerCount(current, max) {
          this._playerCount = current;
          this._maxPlayers = max;

          if (this.playerCountLabel) {
            this.playerCountLabel.string = `${current}/${max}`;
          } // 如果房间满了，更新状态


          if (current >= max && this._status !== "gaming") {
            this._status = "closed";
            this.updateStatusDisplay();
          } else if (current < max && this._status === "closed") {
            this._status = "waiting";
            this.updateStatusDisplay();
          }
        }
        /**
         * 设置房间状态
         */


        setStatus(status) {
          this._status = status;
          this.updateStatusDisplay();
        }
        /**
         * 设置房间是否有密码
         */


        setHasPassword(hasPassword) {
          this._hasPassword = hasPassword;

          if (this.lockedIcon) {
            this.lockedIcon.active = hasPassword;
          }
        }
        /**
         * 设置房间是否为私人房间
         */


        setIsPrivate(isPrivate) {
          this._isPrivate = isPrivate;

          if (this.privateIcon) {
            this.privateIcon.active = isPrivate;
          }
        }
        /**
         * 设置房间是否有好友
         */


        setHasFriends(hasFriends) {
          this._hasFriends = hasFriends;

          if (this.friendsIcon) {
            this.friendsIcon.active = hasFriends;
          }
        }
        /**
         * 更新房间显示
         */


        updateRoomDisplay() {
          if (this.roomIdLabel) {
            this.roomIdLabel.string = `#${this._roomId}`;
          }

          if (this.roomNameLabel) {
            this.roomNameLabel.string = this._roomName;
          }

          if (this.playerCountLabel) {
            this.playerCountLabel.string = `${this._playerCount}/${this._maxPlayers}`;
          }

          this.updateStatusDisplay();

          if (this.lockedIcon) {
            this.lockedIcon.active = this._hasPassword;
          }

          if (this.privateIcon) {
            this.privateIcon.active = this._isPrivate;
          }

          if (this.friendsIcon) {
            this.friendsIcon.active = this._hasFriends;
          }
        }
        /**
         * 更新状态显示
         */


        updateStatusDisplay() {
          // 更新状态文本
          if (this.statusLabel) {
            switch (this._status) {
              case "waiting":
                this.statusLabel.string = '等待中';
                this.statusLabel.color = this.WAITING_COLOR;
                break;

              case "gaming":
                this.statusLabel.string = '游戏中';
                this.statusLabel.color = this.PLAYING_COLOR;
                break;

              case "closed":
                this.statusLabel.string = '已满';
                this.statusLabel.color = this.FULL_COLOR;
                break;
            }
          } // 更新游戏中图标


          if (this.playingIcon) {
            this.playingIcon.active = this._status === "gaming";
          } // 更新加入按钮状态


          if (this.joinButton) {
            this.joinButton.interactable = this._status !== "closed";
          }
        }
        /**
         * 房间列表项被点击事件处理
         */


        onRoomItemClicked() {
          // 播放点击反馈动画
          this.playClickFeedback(); // 发出房间被点击的事件

          this.node.emit('room-item-clicked', {
            roomId: this._roomId,
            roomName: this._roomName,
            hasPassword: this._hasPassword
          });
        }
        /**
         * 加入按钮被点击事件处理
         */


        onJoinButtonClicked() {
          console.log(`[RoomItem] Join button clicked for room: ${this._roomId}`); // 添加日志
          // 播放点击反馈动画

          this.playClickFeedback(); // 发出加入房间的事件

          console.log(`[RoomItem] Emitting join-room event for room: ${this._roomId}`); // 添加日志

          this.node.emit('join-room', {
            roomId: this._roomId,
            roomName: this._roomName,
            hasPassword: this._hasPassword
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
         * 播放新房间动画
         */


        playNewItemAnimation() {
          const originalPos = this.node.position.clone();
          const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity); // 设置初始位置和透明度

          this.node.position = new Vec3(originalPos.x - 50, originalPos.y, originalPos.z);
          uiOpacity.opacity = 0; // 播放动画

          tween(this.node).to(0.3, {
            position: originalPos
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 255
          }).start();
        }
        /**
         * 播放高亮动画
         */


        playHighlightAnimation() {
          var _this$backgroundSprit;

          // 记录原始颜色
          const originalColor = (_this$backgroundSprit = this.backgroundSprite) == null || (_this$backgroundSprit = _this$backgroundSprit.color) == null ? void 0 : _this$backgroundSprit.clone();
          if (!originalColor || !this.backgroundSprite) return; // 高亮色

          const highlightColor = new Color(255, 238, 196, 255); // 播放颜色变换动画

          tween(this.backgroundSprite).to(0.3, {
            color: highlightColor
          }).to(0.3, {
            color: originalColor
          }).union().repeat(2).start();
        }
        /**
         * 播放删除动画
         */


        playRemoveAnimation(callback) {
          const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
          tween(this.node).to(0.3, {
            scale: new Vec3(0, this._originalScale.y, 1)
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 0
          }).call(() => {
            if (callback) callback();
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "roomIdLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "roomNameLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "playerCountLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "statusLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "backgroundSprite", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "joinButton", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lockedIcon", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "privateIcon", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "playingIcon", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "friendsIcon", [_dec11], {
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
//# sourceMappingURL=d5fa23d4987bd25e804c205e1b1abfc07cb26e33.js.map