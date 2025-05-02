System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Button, Color, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, CountListItem;

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
      Label = _cc.Label;
      Button = _cc.Button;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "504f6sP7f5ACbrYeZHYEu0H", "count-list-item", undefined);

      // Import Event and Node (Remove EventCustom)
      __checkObsolete__(['_decorator', 'Component', 'Label', 'Button', 'Color', 'Event', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CountListItem", CountListItem = (_dec = ccclass('CountListItem'), _dec2 = property(Label), _dec3 = property(Button), _dec(_class = (_class2 = class CountListItem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "label", _descriptor, this);

          // 添加一个属性来关联 Button 组件
          _initializerDefineProperty(this, "buttonComponent", _descriptor2, this);

          this._count = 0;
          this._handlerTarget = null;
        }

        // Store the target component

        /** Public getter for the count value */
        get countValue() {
          return this._count;
        }
        /**
         * 初始化列表项
         * @param count 该项代表的数量
         * @param handlerTarget 接收 'count-selected' 事件的目标组件 (e.g., BidController)
         */


        setup(count, handlerTarget) {
          this._count = count;
          this._handlerTarget = handlerTarget; // Store the target

          if (this.label) {
            this.label.string = count.toString();
          } // 使用关联的 buttonComponent 属性


          if (this.buttonComponent) {
            // 清除旧的监听器 (更安全地针对特定节点)
            this.buttonComponent.node.off(Button.EventType.CLICK, this.onClick, this); // 不建议在代码中清除编辑器事件 (button.clickEvents = [])
            // 请依赖在编辑器中手动移除错误配置
            // 直接用 node.on 添加监听器

            this.buttonComponent.node.on(Button.EventType.CLICK, this.onClick, this);
          } else {
            // 更新警告信息
            console.warn(`[CountListItem] Button component property 'buttonComponent' not linked in the editor for node of count ${this._count}`);
          }
        }
        /**
         * 处理按钮点击事件
         */


        onClick() {
          var _this$_handlerTarget, _this$_handlerTarget2;

          // 在发射事件前检查按钮是否可交互
          if (this.buttonComponent && !this.buttonComponent.interactable) {
            console.log(`[CountListItem] onClick ignored: Button not interactable for count ${this._count}`);
            return;
          }

          console.log(`[CountListItem] onClick: Calling handler on target for count: ${this._count} from node: ${this.node.name}`);
          console.log(`[CountListItem] Handler target: ${(_this$_handlerTarget = this._handlerTarget) == null ? void 0 : _this$_handlerTarget.name}, Target valid: ${(_this$_handlerTarget2 = this._handlerTarget) == null ? void 0 : _this$_handlerTarget2.isValid}`); // Log target info
          // Check if the target and method exist

          const handlerExists = this._handlerTarget && typeof this._handlerTarget.handleCountSelection === 'function';
          console.log(`[CountListItem] handleCountSelection exists on target: ${handlerExists}`);

          if (handlerExists) {
            try {
              this._handlerTarget.handleCountSelection({
                count: this._count,
                node: this.node
              });

              console.log(`[CountListItem] handleCountSelection called successfully.`);
            } catch (error) {
              console.error(`[CountListItem] Error calling handleCountSelection:`, error);
            }
          } else {
            console.error(`[CountListItem] Handler target or handleCountSelection method not found for count ${this._count}`);
          }
        }
        /**
         * 设置按钮的可交互状态和视觉效果
         * @param interactable 是否可交互
         */


        setInteractable(interactable) {
          // 使用关联的 buttonComponent 属性
          if (this.buttonComponent) {
            this.buttonComponent.interactable = interactable;
          }

          if (this.label) {
            // 根据可交互状态改变标签颜色（示例）
            this.label.color = interactable ? Color.WHITE : Color.GRAY;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "buttonComponent", [_dec3], {
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
//# sourceMappingURL=894e88b11047f8279f1238d0f2a90209316912f5.js.map