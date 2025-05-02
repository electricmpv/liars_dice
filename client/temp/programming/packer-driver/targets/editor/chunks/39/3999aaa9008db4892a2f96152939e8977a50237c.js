System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, Color, tween, Vec3, UIOpacity, SpriteFrame, Button, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, NoticeType, SystemNotice;

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
      Color = _cc.Color;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
      SpriteFrame = _cc.SpriteFrame;
      Button = _cc.Button;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "70d75NNqNlNMq9Aq67hJJxs", "system-notice", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'Color', 'tween', 'Vec3', 'UIOpacity', 'SpriteFrame', 'Button']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 系统通知预制体
       * 功能：
       * 1. 显示系统通知内容和图标
       * 2. 支持不同类型通知显示（信息、警告、错误）
       * 3. 支持自动隐藏和动画效果
       * 4. 支持持久化通知（需要用户确认）
       */
      // 通知类型

      NoticeType = /*#__PURE__*/function (NoticeType) {
        NoticeType["INFO"] = "info";
        NoticeType["WARNING"] = "warning";
        NoticeType["ERROR"] = "error";
        NoticeType["SUCCESS"] = "success";
        return NoticeType;
      }(NoticeType || {});

      _export("SystemNotice", SystemNotice = (_dec = ccclass('SystemNotice'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property(Node), _dec5 = property([SpriteFrame]), _dec6 = property(Button), _dec7 = property(Label), _dec8 = property(Node), _dec(_class = (_class2 = class SystemNotice extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "content", _descriptor, this);

          _initializerDefineProperty(this, "icon", _descriptor2, this);

          _initializerDefineProperty(this, "background", _descriptor3, this);

          _initializerDefineProperty(this, "iconFrames", _descriptor4, this);

          _initializerDefineProperty(this, "autoHideDuration", _descriptor5, this);

          // 自动隐藏的时间（秒）
          _initializerDefineProperty(this, "confirmButton", _descriptor6, this);

          // 确认按钮
          _initializerDefineProperty(this, "confirmButtonLabel", _descriptor7, this);

          // 确认按钮文本
          _initializerDefineProperty(this, "persistentDecoration", _descriptor8, this);

          // 持久化通知的装饰（边框等）
          _initializerDefineProperty(this, "persistent", _descriptor9, this);

          // 是否为持久化通知（需要用户确认）
          // 颜色常量
          this.INFO_COLOR = new Color(42, 130, 228, 255);
          // 蓝色
          this.WARNING_COLOR = new Color(245, 166, 35, 255);
          // 橙色
          this.ERROR_COLOR = new Color(231, 76, 60, 255);
          // 红色
          this.SUCCESS_COLOR = new Color(46, 204, 113, 255);
          // 绿色
          this._hideTimeout = null;
          this._originalPosition = new Vec3();
          this._isVisible = false;
          this._noticeId = '';
          // 通知唯一ID
          this._noticeData = null;
        }

        // 通知携带的数据
        onLoad() {
          // 初始隐藏
          this._originalPosition = this.node.position.clone();
          this.node.active = false; // 注册确认按钮事件

          if (this.confirmButton) {
            this.confirmButton.node.on('click', this.onConfirmButtonClicked, this);
          }
        }

        onDestroy() {
          // 清除可能存在的定时器
          if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
          } // 移除事件监听，并检查节点有效性


          if (this.confirmButton && this.confirmButton.isValid && this.confirmButton.node && this.confirmButton.node.isValid) {
            this.confirmButton.node.off('click', this.onConfirmButtonClicked, this);
          }
        }
        /**
         * 设置通知ID
         */


        setNoticeId(id) {
          this._noticeId = id;
        }
        /**
         * 获取通知ID
         */


        getNoticeId() {
          return this._noticeId;
        }
        /**
         * 设置通知数据
         */


        setNoticeData(data) {
          this._noticeData = data;
        }
        /**
         * 获取通知数据
         */


        getNoticeData() {
          return this._noticeData;
        }
        /**
         * 显示系统通知
         * @param text 通知内容
         * @param type 通知类型
         * @param duration 显示时长（秒），设为0则不自动隐藏
         * @param isPersistent 是否为持久化通知（需要用户确认）
         * @param confirmText 确认按钮文本
         * @param noticeId 通知唯一ID
         * @param noticeData 通知携带的数据
         */


        show(text, type = 'info', duration, isPersistent = false, confirmText = '确认', noticeId = '', noticeData = null) {
          var _this$background;

          // 如果已经在显示，先隐藏当前的
          if (this._isVisible) {
            this.hideImmediately();
          } // 设置通知ID和数据


          this._noticeId = noticeId;
          this._noticeData = noticeData; // 设置持久化状态

          this.persistent = isPersistent; // 设置内容

          if (this.content) {
            this.content.string = text;
          } // 设置图标


          if (this.icon && this.iconFrames.length > 0) {
            let iconIndex = 0;

            switch (type) {
              case NoticeType.INFO:
                iconIndex = 0;
                break;

              case NoticeType.WARNING:
                iconIndex = 1;
                break;

              case NoticeType.ERROR:
                iconIndex = 2;
                break;

              case NoticeType.SUCCESS:
                iconIndex = 3;
                break;
            } // 确保索引在有效范围内


            if (iconIndex < this.iconFrames.length) {
              this.icon.spriteFrame = this.iconFrames[iconIndex];
            }
          } // 设置背景颜色


          const bgSprite = (_this$background = this.background) == null ? void 0 : _this$background.getComponent(Sprite);

          if (bgSprite) {
            switch (type) {
              case NoticeType.INFO:
                bgSprite.color = this.INFO_COLOR;
                break;

              case NoticeType.WARNING:
                bgSprite.color = this.WARNING_COLOR;
                break;

              case NoticeType.ERROR:
                bgSprite.color = this.ERROR_COLOR;
                break;

              case NoticeType.SUCCESS:
                bgSprite.color = this.SUCCESS_COLOR;
                break;
            }
          } // 配置确认按钮


          if (this.confirmButton) {
            this.confirmButton.node.active = this.persistent;

            if (this.confirmButtonLabel && this.persistent) {
              this.confirmButtonLabel.string = confirmText;
            }
          } // 设置持久化装饰


          if (this.persistentDecoration) {
            this.persistentDecoration.active = this.persistent;
          } // 显示通知


          this.node.active = true;
          this._isVisible = true; // 播放显示动画

          this.playShowAnimation(); // 设置自动隐藏（仅非持久化通知）

          if (!this.persistent) {
            const hideTime = duration !== undefined ? duration : this.autoHideDuration;

            if (hideTime > 0) {
              // 清除可能存在的旧定时器
              if (this._hideTimeout) {
                clearTimeout(this._hideTimeout);
              } // 设置新的定时器


              this._hideTimeout = setTimeout(() => {
                // 在定时器回调中检查节点是否仍然有效
                if (this.node && this.node.isValid) {
                  this.hide();
                }

                this._hideTimeout = null; // 无论如何都清除 timeout 引用
              }, hideTime * 1000);
            }
          }
        }
        /**
         * 确认按钮点击处理
         */


        onConfirmButtonClicked() {
          // 发送确认事件
          this.node.emit('notice-confirmed', {
            noticeId: this._noticeId,
            noticeData: this._noticeData
          }); // 隐藏通知

          this.hide();
        }
        /**
         * 隐藏通知（带动画）
         */


        hide() {
          if (!this._isVisible) return;
          this.playHideAnimation();
        }
        /**
         * 立即隐藏通知（无动画）
         */


        hideImmediately() {
          if (!this._isVisible) return;
          this._isVisible = false;
          this.node.active = false; // 重置位置

          this.node.position = this._originalPosition.clone(); // 清除可能存在的定时器

          if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
          }
        }
        /**
         * 播放显示动画
         */


        playShowAnimation() {
          // 重置位置和透明度
          this.node.position = new Vec3(this._originalPosition.x, this._originalPosition.y - 50, this._originalPosition.z);
          const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
          uiOpacity.opacity = 0; // 从下方滑入并淡入

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
          // 在动画开始前检查节点有效性
          if (!this.node || !this.node.isValid) {
            console.warn('[SystemNotice] playHideAnimation called on an invalid node.');
            return;
          }

          const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity); // 向上滑出并淡出

          tween(this.node) // 此时 node 保证有效
          .to(0.3, {
            position: new Vec3(this._originalPosition.x, this._originalPosition.y + 50, this._originalPosition.z)
          }).start();
          tween(uiOpacity).to(0.3, {
            opacity: 0
          }).call(() => {
            this._isVisible = false;
            this.node.active = false;
            this.node.position = this._originalPosition.clone();
          }).start();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "content", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "background", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "iconFrames", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "autoHideDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "confirmButton", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "confirmButtonLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "persistentDecoration", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "persistent", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3999aaa9008db4892a2f96152939e8977a50237c.js.map