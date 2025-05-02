System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Button, Label, tween, Vec3, UIOpacity, PlayerItem, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, RequestType, FriendRequest;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayerItem(extras) {
    _reporterNs.report("PlayerItem", "./player-item", _context.meta, extras);
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
      Button = _cc.Button;
      Label = _cc.Label;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
    }, function (_unresolved_2) {
      PlayerItem = _unresolved_2.PlayerItem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4e98bWUnA5EO6Usr/406cg9", "friend-request", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Button', 'Label', 'tween', 'Vec3', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 好友请求预制体
       * 功能：
       * 1. 显示发送请求的玩家信息
       * 2. 提供接受和拒绝按钮
       * 3. 支持请求动画显示和消失
       * 4. 区分不同类型的请求来源
       */
      // 请求类型枚举

      RequestType = /*#__PURE__*/function (RequestType) {
        RequestType["FRIEND_REQUEST"] = "friend";
        RequestType["ROOM_INVITE"] = "room";
        RequestType["TEAM_INVITE"] = "team";
        RequestType["GAME_INVITE"] = "game";
        return RequestType;
      }(RequestType || {});

      _export("FriendRequest", FriendRequest = (_dec = ccclass('FriendRequest'), _dec2 = property(_crd && PlayerItem === void 0 ? (_reportPossibleCrUseOfPlayerItem({
        error: Error()
      }), PlayerItem) : PlayerItem), _dec3 = property(Button), _dec4 = property(Button), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property(Node), _dec(_class = (_class2 = class FriendRequest extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "playerInfo", _descriptor, this);

          _initializerDefineProperty(this, "acceptButton", _descriptor2, this);

          _initializerDefineProperty(this, "rejectButton", _descriptor3, this);

          _initializerDefineProperty(this, "requestMessage", _descriptor4, this);

          _initializerDefineProperty(this, "timerLabel", _descriptor5, this);

          _initializerDefineProperty(this, "requestTypeLabel", _descriptor6, this);

          // 显示请求类型的标签
          _initializerDefineProperty(this, "friendRequestIcon", _descriptor7, this);

          // 好友请求图标
          _initializerDefineProperty(this, "roomInviteIcon", _descriptor8, this);

          // 房间邀请图标
          _initializerDefineProperty(this, "teamInviteIcon", _descriptor9, this);

          // 组队邀请图标
          _initializerDefineProperty(this, "gameInviteIcon", _descriptor10, this);

          // 游戏邀请图标
          this._requestId = '';
          this._senderId = '';
          this._requestTime = 0;
          this._expirationTime = 300;
          // 请求过期时间（秒）
          this._requestType = RequestType.FRIEND_REQUEST;
          // 请求类型
          this._roomId = '';
          // 房间ID（针对房间邀请）
          this._countdownTimer = null;
          this._originalPosition = new Vec3();
          this._isVisible = false;
        }

        onLoad() {
          this._originalPosition = this.node.position.clone();
          this.node.active = false;
        }

        start() {
          // 注册按钮点击事件
          if (this.acceptButton) {
            this.acceptButton.node.on('click', this.onAcceptButtonClicked, this);
          }

          if (this.rejectButton) {
            this.rejectButton.node.on('click', this.onRejectButtonClicked, this);
          }
        }

        onDestroy() {
          // 移除事件监听
          if (this.acceptButton) {
            this.acceptButton.node.off('click', this.onAcceptButtonClicked, this);
          }

          if (this.rejectButton) {
            this.rejectButton.node.off('click', this.onRejectButtonClicked, this);
          } // 清除定时器


          this.clearCountdownTimer();
        }
        /**
         * 显示好友请求
         * @param requestInfo 请求信息
         */


        show(requestInfo) {
          if (this._isVisible) {
            this.hideImmediately();
          } // 保存请求信息


          this._requestId = requestInfo.requestId;
          this._senderId = requestInfo.senderId;
          this._requestTime = Date.now();

          if (requestInfo.expirationTime) {
            this._expirationTime = requestInfo.expirationTime;
          } // 设置请求类型


          if (requestInfo.requestType) {
            this._requestType = requestInfo.requestType;
          } else {
            this._requestType = RequestType.FRIEND_REQUEST;
          } // 保存额外信息


          if (requestInfo.roomId) {
            this._roomId = requestInfo.roomId;
          } // 设置玩家信息


          if (this.playerInfo) {
            this.playerInfo.setPlayerId(requestInfo.senderId);
            this.playerInfo.setPlayerName(requestInfo.senderName);
          } // 设置请求消息


          if (this.requestMessage) {
            if (requestInfo.message) {
              this.requestMessage.string = requestInfo.message;
            } else {
              // 根据请求类型生成默认消息
              switch (this._requestType) {
                case RequestType.FRIEND_REQUEST:
                  this.requestMessage.string = `${requestInfo.senderName} 请求添加您为好友`;
                  break;

                case RequestType.ROOM_INVITE:
                  this.requestMessage.string = `${requestInfo.senderName} 邀请您加入房间 ${this._roomId}`;
                  break;

                case RequestType.TEAM_INVITE:
                  this.requestMessage.string = `${requestInfo.senderName} 邀请您加入队伍`;
                  break;

                case RequestType.GAME_INVITE:
                  this.requestMessage.string = `${requestInfo.senderName} 邀请您一起游戏`;
                  break;
              }
            }
          } // 设置请求类型标签


          if (this.requestTypeLabel) {
            switch (this._requestType) {
              case RequestType.FRIEND_REQUEST:
                this.requestTypeLabel.string = "好友申请";
                break;

              case RequestType.ROOM_INVITE:
                this.requestTypeLabel.string = "房间邀请";
                break;

              case RequestType.TEAM_INVITE:
                this.requestTypeLabel.string = "组队邀请";
                break;

              case RequestType.GAME_INVITE:
                this.requestTypeLabel.string = "游戏邀请";
                break;
            }
          } // 更新图标显示


          this.updateRequestTypeIcon(); // 显示请求窗口

          this.node.active = true;
          this._isVisible = true; // 开始倒计时

          this.startCountdown(); // 播放显示动画

          this.playShowAnimation();
        }
        /**
         * 更新请求类型图标
         */


        updateRequestTypeIcon() {
          // 隐藏所有图标
          if (this.friendRequestIcon) this.friendRequestIcon.active = false;
          if (this.roomInviteIcon) this.roomInviteIcon.active = false;
          if (this.teamInviteIcon) this.teamInviteIcon.active = false;
          if (this.gameInviteIcon) this.gameInviteIcon.active = false; // 根据请求类型显示对应图标

          switch (this._requestType) {
            case RequestType.FRIEND_REQUEST:
              if (this.friendRequestIcon) this.friendRequestIcon.active = true;
              break;

            case RequestType.ROOM_INVITE:
              if (this.roomInviteIcon) this.roomInviteIcon.active = true;
              break;

            case RequestType.TEAM_INVITE:
              if (this.teamInviteIcon) this.teamInviteIcon.active = true;
              break;

            case RequestType.GAME_INVITE:
              if (this.gameInviteIcon) this.gameInviteIcon.active = true;
              break;
          }
        }
        /**
         * 隐藏请求（带动画）
         */


        hide() {
          if (!this._isVisible) return;
          this.playHideAnimation();
        }
        /**
         * 立即隐藏请求（无动画）
         */


        hideImmediately() {
          if (!this._isVisible) return;
          this._isVisible = false;
          this.node.active = false; // 重置位置

          this.node.position = this._originalPosition.clone(); // 清除倒计时

          this.clearCountdownTimer();
        }
        /**
         * 开始倒计时
         */


        startCountdown() {
          // 清除可能存在的旧定时器
          this.clearCountdownTimer(); // 更新倒计时显示

          this.updateTimerDisplay(); // 设置新的倒计时

          this._countdownTimer = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this._requestTime) / 1000);
            const remainingTime = this._expirationTime - elapsedTime;

            if (remainingTime <= 0) {
              // 请求过期，自动拒绝
              this.clearCountdownTimer();
              this.onRequestExpired();
            } else {
              // 更新倒计时显示
              this.updateTimerDisplay(remainingTime);
            }
          }, 1000);
        }
        /**
         * 清除倒计时定时器
         */


        clearCountdownTimer() {
          if (this._countdownTimer) {
            clearInterval(this._countdownTimer);
            this._countdownTimer = null;
          }
        }
        /**
         * 更新倒计时显示
         */


        updateTimerDisplay(remainingTime) {
          if (!this.timerLabel) return;

          if (remainingTime === undefined) {
            const elapsedTime = Math.floor((Date.now() - this._requestTime) / 1000);
            remainingTime = this._expirationTime - elapsedTime;
          } // 确保不为负数


          remainingTime = Math.max(0, remainingTime); // 格式化为分:秒

          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          this.timerLabel.string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        /**
         * 接受按钮点击处理
         */


        onAcceptButtonClicked() {
          // 播放点击动画
          this.playButtonClickAnimation(this.acceptButton.node); // 触发接受事件

          this.node.emit('request-accepted', {
            requestId: this._requestId,
            senderId: this._senderId,
            requestType: this._requestType,
            roomId: this._roomId
          }); // 隐藏请求

          this.hide();
        }
        /**
         * 拒绝按钮点击处理
         */


        onRejectButtonClicked() {
          // 播放点击动画
          this.playButtonClickAnimation(this.rejectButton.node); // 触发拒绝事件

          this.node.emit('request-rejected', {
            requestId: this._requestId,
            senderId: this._senderId,
            requestType: this._requestType,
            roomId: this._roomId
          }); // 隐藏请求

          this.hide();
        }
        /**
         * 请求过期处理
         */


        onRequestExpired() {
          // 触发过期事件
          this.node.emit('request-expired', {
            requestId: this._requestId,
            senderId: this._senderId,
            requestType: this._requestType,
            roomId: this._roomId
          }); // 隐藏请求

          this.hide();
        }
        /**
         * 播放按钮点击动画
         */


        playButtonClickAnimation(buttonNode) {
          const originalScale = buttonNode.scale.clone();
          tween(buttonNode).to(0.1, {
            scale: new Vec3(originalScale.x * 0.9, originalScale.y * 0.9, 1)
          }).to(0.1, {
            scale: originalScale
          }).start();
        }
        /**
         * 播放显示动画
         */


        playShowAnimation() {
          // 设置初始位置（从顶部滑入）
          this.node.position = new Vec3(this._originalPosition.x, this._originalPosition.y + 100, this._originalPosition.z);
          const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
          uiOpacity.opacity = 0; // 播放动画

          tween(this.node).to(0.3, {
            position: this._originalPosition
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 255
          }).start();
        }
        /**
         * 播放隐藏动画
         */


        playHideAnimation() {
          const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity); // 向右滑出并淡出

          tween(this.node).to(0.3, {
            position: new Vec3(this._originalPosition.x + 100, this._originalPosition.y, this._originalPosition.z)
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 0
          }).call(() => {
            this._isVisible = false;
            this.node.active = false;
            this.node.position = this._originalPosition.clone();
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "playerInfo", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "acceptButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rejectButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "requestMessage", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "timerLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "requestTypeLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "friendRequestIcon", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "roomInviteIcon", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "teamInviteIcon", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "gameInviteIcon", [_dec11], {
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
//# sourceMappingURL=4f34a100457f4341e1c839cb1aa7e6a3067c5e83.js.map