System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, RichText, Color, UITransform, tween, Vec3, Widget, UIOpacity, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, MessageType, ChatItem;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
      RichText = _cc.RichText;
      Color = _cc.Color;
      UITransform = _cc.UITransform;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Widget = _cc.Widget;
      UIOpacity = _cc.UIOpacity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "310d2ti3klO/KJ4eiWkDGZj", "chat-item", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'RichText', 'Color', 'UITransform', 'tween', 'Vec3', 'Widget', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 聊天消息预制体
       * 功能：
       * 1. 支持不同类型消息（玩家消息、系统消息、公告等）
       * 2. 显示发送者头像、名称、消息内容和时间
       * 3. 支持消息动画效果
       * 4. 适配不同长度的消息内容
       */
      // 消息类型枚举

      MessageType = /*#__PURE__*/function (MessageType) {
        MessageType[MessageType["SELF"] = 0] = "SELF";
        MessageType[MessageType["OTHER"] = 1] = "OTHER";
        MessageType[MessageType["SYSTEM"] = 2] = "SYSTEM";
        MessageType[MessageType["GAME"] = 3] = "GAME";
        MessageType[MessageType["NOTICE"] = 4] = "NOTICE";
        return MessageType;
      }(MessageType || {});

      _export("ChatItem", ChatItem = (_dec = ccclass('ChatItem'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Sprite), _dec6 = property(Label), _dec7 = property(RichText), _dec8 = property(Label), _dec9 = property(Node), _dec(_class = (_class2 = class ChatItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "selfMessageNode", _descriptor, this);

          _initializerDefineProperty(this, "otherMessageNode", _descriptor2, this);

          _initializerDefineProperty(this, "systemMessageNode", _descriptor3, this);

          _initializerDefineProperty(this, "avatarSprite", _descriptor4, this);

          _initializerDefineProperty(this, "senderNameLabel", _descriptor5, this);

          _initializerDefineProperty(this, "messageText", _descriptor6, this);

          _initializerDefineProperty(this, "timeLabel", _descriptor7, this);

          _initializerDefineProperty(this, "messageContainer", _descriptor8, this);

          // 消息数据
          this._messageData = {
            id: '',
            type: MessageType.OTHER,
            senderId: '',
            senderName: '',
            content: '',
            timestamp: 0,
            isRead: false
          };
          this._originalScale = new Vec3(1, 1, 1);
          // 颜色常量
          this.SELF_MSG_COLOR = new Color(220, 248, 198, 255);
          // 浅绿色
          this.OTHER_MSG_COLOR = new Color(255, 255, 255, 255);
          // 白色
          this.SYSTEM_MSG_COLOR = new Color(200, 200, 200, 255);
          // 浅灰色
          this.GAME_MSG_COLOR = new Color(255, 236, 217, 255);
          // 浅黄色
          this.NOTICE_MSG_COLOR = new Color(217, 237, 255, 255);
        }

        // 浅蓝色
        onLoad() {
          this._originalScale = this.node.scale.clone();
        }

        start() {
          this.node.on(Node.EventType.TOUCH_END, this.onChatItemClicked, this);
        }

        onDestroy() {
          this.node.off(Node.EventType.TOUCH_END, this.onChatItemClicked, this);
        }
        /**
         * 设置消息数据
         */


        setMessageData(data) {
          this._messageData = _extends({}, data, {
            isRead: data.isRead !== undefined ? data.isRead : false
          });
          this.updateMessageDisplay();
        }
        /**
         * 获取消息ID
         */


        getMessageId() {
          return this._messageData.id;
        }
        /**
         * 获取发送者ID
         */


        getSenderId() {
          return this._messageData.senderId;
        }
        /**
         * 设置消息类型
         */


        setMessageType(type) {
          this._messageData.type = type;
          this.updateMessageNodeVisibility();
          this.updateMessageColor();
        }
        /**
         * 设置消息内容
         */


        setMessageContent(content) {
          this._messageData.content = content;

          if (this.messageText) {
            this.messageText.string = this.formatMessageContent(content);
          }

          this.updateMessageSize();
        }
        /**
         * 设置发送者名称
         */


        setSenderName(name) {
          this._messageData.senderName = name;

          if (this.senderNameLabel) {
            this.senderNameLabel.string = name;
          }
        }
        /**
         * 设置消息时间
         * @param timestamp 时间戳
         */


        setMessageTime(timestamp) {
          this._messageData.timestamp = timestamp;

          if (this.timeLabel) {
            this.timeLabel.string = this.formatTime(timestamp);
          }
        }
        /**
         * 设置消息已读状态
         */


        setIsRead(isRead) {
          this._messageData.isRead = isRead;
        }
        /**
         * 设置发送者头像
         */


        setAvatar(spriteFrame) {
          if (this.avatarSprite && spriteFrame) {
            this.avatarSprite.spriteFrame = spriteFrame;
          }
        }
        /**
         * 更新消息显示
         */


        updateMessageDisplay() {
          this.updateMessageNodeVisibility();

          if (this.senderNameLabel) {
            this.senderNameLabel.string = this._messageData.senderName;
          }

          if (this.messageText) {
            this.messageText.string = this.formatMessageContent(this._messageData.content);
          }

          if (this.timeLabel) {
            this.timeLabel.string = this.formatTime(this._messageData.timestamp);
          }

          this.updateMessageColor();
          this.updateMessageSize();
        }
        /**
         * 更新消息节点可见性
         */


        updateMessageNodeVisibility() {
          if (this.selfMessageNode) {
            this.selfMessageNode.active = this._messageData.type === MessageType.SELF;
          }

          if (this.otherMessageNode) {
            this.otherMessageNode.active = this._messageData.type === MessageType.OTHER;
          }

          if (this.systemMessageNode) {
            this.systemMessageNode.active = this._messageData.type === MessageType.SYSTEM || this._messageData.type === MessageType.GAME || this._messageData.type === MessageType.NOTICE;
          }
        }
        /**
         * 更新消息颜色
         */


        updateMessageColor() {
          if (!this.messageContainer) return;
          var sprite = this.messageContainer.getComponent(Sprite);
          if (!sprite) return; // 根据消息类型设置不同颜色

          switch (this._messageData.type) {
            case MessageType.SELF:
              sprite.color = this.SELF_MSG_COLOR;
              break;

            case MessageType.OTHER:
              sprite.color = this.OTHER_MSG_COLOR;
              break;

            case MessageType.SYSTEM:
              sprite.color = this.SYSTEM_MSG_COLOR;
              break;

            case MessageType.GAME:
              sprite.color = this.GAME_MSG_COLOR;
              break;

            case MessageType.NOTICE:
              sprite.color = this.NOTICE_MSG_COLOR;
              break;
          }
        }
        /**
         * 根据内容更新消息大小
         */


        updateMessageSize() {
          var _this$messageText$nod;

          if (!this.messageText || !this.messageContainer) return; // 获取富文本内容大小

          var textSize = (_this$messageText$nod = this.messageText.node.getComponent(UITransform)) == null ? void 0 : _this$messageText$nod.contentSize;
          if (!textSize) return; // 设置消息容器的最小宽度和高度（考虑内边距）

          var padding = 20; // 左右内边距

          var minWidth = 60; // 最小宽度

          var maxWidth = 240; // 最大宽度（避免消息过宽）
          // 根据文本大小调整容器宽度，并确保在最小和最大宽度之间

          var newWidth = Math.max(minWidth, textSize.width + padding * 2);
          newWidth = Math.min(newWidth, maxWidth); // 更新容器大小

          var containerTransform = this.messageContainer.getComponent(UITransform);

          if (containerTransform) {
            containerTransform.width = newWidth; // 强制重新布局

            var widget = this.messageContainer.getComponent(Widget);

            if (widget) {
              widget.updateAlignment();
            }
          }
        }
        /**
         * 格式化消息内容
         * @param content 原始消息内容
         * @returns 格式化后的富文本内容
         */


        formatMessageContent(content) {
          // 处理表情符号
          content = content.replace(/:([\w]+):/g, (match, p1) => {
            return "<img src=\"emoji_" + p1 + "\" width=24 height=24 />";
          }); // 处理URL链接

          content = content.replace(/(https?:\/\/[^\s]+)/g, url => {
            return "<color=#0000ff><u>" + url + "</u></color>";
          });
          return content;
        }
        /**
         * 格式化时间
         * @param timestamp 时间戳（毫秒）
         * @returns 格式化的时间字符串
         */


        formatTime(timestamp) {
          if (!timestamp) return '';
          var date = new Date(timestamp);
          var now = new Date(); // 如果是今天的消息，只显示时间

          if (date.toDateString() === now.toDateString()) {
            return this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
          } // 如果是昨天的消息


          var yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);

          if (date.toDateString() === yesterday.toDateString()) {
            return '昨天 ' + this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
          } // 如果是今年的消息


          if (date.getFullYear() === now.getFullYear()) {
            return date.getMonth() + 1 + '月' + date.getDate() + '日 ' + this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
          } // 其他情况显示完整日期


          return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + this.padZero(date.getHours()) + ':' + this.padZero(date.getMinutes());
        }
        /**
         * 数字补零
         */


        padZero(num) {
          return num < 10 ? '0' + num : num.toString();
        }
        /**
         * 消息项被点击的事件处理
         */


        onChatItemClicked() {
          // 播放点击反馈动画
          this.playClickFeedback(); // 发出消息被点击的事件

          this.node.emit('chat-item-clicked', {
            messageId: this._messageData.id,
            senderId: this._messageData.senderId,
            senderName: this._messageData.senderName,
            content: this._messageData.content
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
         * 播放新消息动画（从下方滑入）
         */


        playNewMessageAnimation() {
          var originalPos = this.node.position.clone();
          var uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity); // 设置初始位置在下方

          this.node.position = new Vec3(originalPos.x, originalPos.y - 50, originalPos.z);
          uiOpacity.opacity = 0; // 播放动画

          tween(this.node).to(0.3, {
            position: originalPos
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 255
          }).start();
        }
        /**
         * 播放消息高亮动画（用于提醒用户查看）
         */


        playHighlightAnimation() {
          var _this$messageContaine;

          var originalColor = (_this$messageContaine = this.messageContainer) == null || (_this$messageContaine = _this$messageContaine.getComponent(Sprite)) == null ? void 0 : _this$messageContaine.color.clone();
          if (!originalColor || !this.messageContainer) return; // 高亮色

          var highlightColor = new Color(255, 242, 204, 255);
          var sprite = this.messageContainer.getComponent(Sprite);
          if (!sprite) return; // 播放颜色变换动画

          tween(sprite).to(0.3, {
            color: highlightColor
          }).to(0.3, {
            color: originalColor
          }).union().repeat(2).start();
        }
        /**
         * 播放删除动画（消息被撤回）
         * @param callback 动画完成后回调
         */


        playRemoveAnimation(callback) {
          var uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
          tween(this.node).to(0.3, {
            scale: new Vec3(0.5, 0.5, 1)
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 0
          }).call(() => {
            if (callback) callback();
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "selfMessageNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "otherMessageNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "systemMessageNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "avatarSprite", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "senderNameLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "messageText", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "timeLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "messageContainer", [_dec9], {
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
//# sourceMappingURL=a233f6b2d6545cf8ed5ce06d657889dbae7ab211.js.map