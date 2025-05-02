System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Button, Color, tween, Vec3, UIOpacity, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, FilterTab;

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
      Button = _cc.Button;
      Color = _cc.Color;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      UIOpacity = _cc.UIOpacity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fe88dw+AtVE5rTXzkTs9/WT", "filter-tab", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Button', 'Color', 'tween', 'Vec3', 'UIOpacity']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 过滤标签预制体
       * 功能：
       * 1. 显示标签名称
       * 2. 支持选中状态显示
       * 3. 点击切换选中状态
       * 4. 支持动画效果
       * 5. 支持标签分组管理
       */

      _export("FilterTab", FilterTab = (_dec = ccclass('FilterTab'), _dec2 = property(Label), _dec3 = property(Node), _dec4 = property(Button), _dec(_class = (_class2 = class FilterTab extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tabName", _descriptor, this);

          _initializerDefineProperty(this, "indicator", _descriptor2, this);

          _initializerDefineProperty(this, "button", _descriptor3, this);

          _initializerDefineProperty(this, "groupId", _descriptor4, this);

          // 标签所属分组ID
          _initializerDefineProperty(this, "tabIndex", _descriptor5, this);

          // 标签在组内的索引
          this._isSelected = false;
          this._tabId = '';
          this._originalScale = new Vec3(1, 1, 1);
          this._groupManager = null;
          // 标签组管理器引用
          // 颜色常量
          this.SELECTED_COLOR = new Color(255, 204, 0, 255);
          // 选中时标签颜色（金色）
          this.NORMAL_COLOR = new Color(255, 255, 255, 255);
        }

        // 未选中时标签颜色（白色）
        onLoad() {
          this._originalScale = this.node.scale.clone(); // 初始状态

          this.updateAppearance();
        }

        start() {
          // 注册点击事件
          if (this.button) {
            this.button.node.on('click', this.onTabClicked, this);
          } else {
            this.node.on(Node.EventType.TOUCH_END, this.onTabClicked, this);
          }
        }

        onDestroy() {
          // 移除事件监听
          if (this.button) {
            this.button.node.off('click', this.onTabClicked, this);
          } else {
            this.node.off(Node.EventType.TOUCH_END, this.onTabClicked, this);
          }
        }
        /**
         * 设置标签ID
         */


        setTabId(id) {
          this._tabId = id;
        }
        /**
         * 获取标签ID
         */


        getTabId() {
          return this._tabId;
        }
        /**
         * 设置标签名称
         */


        setTabName(name) {
          if (this.tabName) {
            this.tabName.string = name;
          }
        }
        /**
         * 设置分组ID
         */


        setGroupId(id) {
          this.groupId = id;
        }
        /**
         * 获取分组ID
         */


        getGroupId() {
          return this.groupId;
        }
        /**
         * 设置标签在组内的索引
         */


        setTabIndex(index) {
          this.tabIndex = index;
        }
        /**
         * 获取标签在组内的索引
         */


        getTabIndex() {
          return this.tabIndex;
        }
        /**
         * 设置标签组管理器
         */


        setGroupManager(manager) {
          this._groupManager = manager;
        }
        /**
         * 设置选中状态
         */


        setSelected(selected, fireEvent = false) {
          if (this._isSelected === selected) return;
          this._isSelected = selected;
          this.updateAppearance(); // 播放选中/取消选中动画

          this.playSelectionAnimation(); // 通知组管理器（如果存在）

          if (selected && this._groupManager) {
            this._groupManager.selectTab(this);
          } // 触发事件（如果需要）


          if (fireEvent) {
            this.node.emit('tab-selected', {
              tabId: this._tabId,
              groupId: this.groupId,
              tabIndex: this.tabIndex,
              isSelected: this._isSelected
            });
          }
        }
        /**
         * 获取选中状态
         */


        isSelected() {
          return this._isSelected;
        }
        /**
         * 更新外观
         */


        updateAppearance() {
          // 更新指示器
          if (this.indicator) {
            this.indicator.active = this._isSelected;
          } // 更新标签文字颜色


          if (this.tabName) {
            this.tabName.color = this._isSelected ? this.SELECTED_COLOR : this.NORMAL_COLOR;
          } // 更新按钮状态


          if (this.button) {
            this.button.interactable = !this._isSelected; // 已选中的标签不可再点击
          }
        }
        /**
         * 标签点击事件处理
         */


        onTabClicked() {
          // 如果已选中则不处理
          if (this._isSelected) return; // 设置为选中状态

          this.setSelected(true, true); // 播放点击反馈动画

          this.playClickFeedback();
        }
        /**
         * 播放点击反馈动画
         */


        playClickFeedback() {
          tween(this.node).to(0.1, {
            scale: new Vec3(this._originalScale.x * 0.9, this._originalScale.y * 0.9, 1)
          }).to(0.1, {
            scale: this._originalScale
          }).start();
        }
        /**
         * 播放选中/取消选中动画
         */


        playSelectionAnimation() {
          if (this._isSelected) {
            // 选中动画
            tween(this.node).to(0.2, {
              scale: new Vec3(this._originalScale.x * 1.1, this._originalScale.y * 1.1, 1)
            }).to(0.2, {
              scale: this._originalScale
            }).start(); // 指示器动画

            if (this.indicator) {
              this.indicator.active = true;
              const uiOpacity = this.indicator.getComponent(UIOpacity) || this.indicator.addComponent(UIOpacity);
              uiOpacity.opacity = 0;
              tween(uiOpacity).to(0.3, {
                opacity: 255
              }).start();
            }
          } else {
            // 取消选中动画
            if (this.indicator) {
              const uiOpacity = this.indicator.getComponent(UIOpacity) || this.indicator.addComponent(UIOpacity);
              tween(uiOpacity).to(0.2, {
                opacity: 0
              }).call(() => {
                this.indicator.active = false;
              }).start();
            }
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tabName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "indicator", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "button", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "groupId", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "default";
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "tabIndex", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a1e39b0181830a8a89a4ea243e17121f5598e5ae.js.map