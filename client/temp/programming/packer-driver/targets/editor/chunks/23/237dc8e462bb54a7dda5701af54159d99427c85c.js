System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, Label, ScrollView, Color, GameStateManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, GameHistoryPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameStateManager(extras) {
    _reporterNs.report("GameStateManager", "../core/game-state-manager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHistoryItem(extras) {
    _reporterNs.report("HistoryItem", "../core/game-state-manager", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Label = _cc.Label;
      ScrollView = _cc.ScrollView;
      Color = _cc.Color;
    }, function (_unresolved_2) {
      GameStateManager = _unresolved_2.GameStateManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "348c7fjcnNJD7jwPktzs1h5", "game-history-panel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Label', 'ScrollView', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 游戏历史记录面板
       * 负责显示游戏历史记录
       */

      _export("GameHistoryPanel", GameHistoryPanel = (_dec = ccclass('GameHistoryPanel'), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(ScrollView), _dec(_class = (_class2 = class GameHistoryPanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "historyContent", _descriptor, this);

          _initializerDefineProperty(this, "historyItemPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "scrollView", _descriptor3, this);

          this.gameStateManager = (_crd && GameStateManager === void 0 ? (_reportPossibleCrUseOfGameStateManager({
            error: Error()
          }), GameStateManager) : GameStateManager).instance;

          this._onHistoryUpdatedCallback = data => this.handleHistoryUpdated(data);
        }

        onLoad() {
          // 监听历史记录更新事件
          this.gameStateManager.on('history-updated', this._onHistoryUpdatedCallback);
          console.log("[GameHistoryPanel] onLoad完成，已注册历史记录监听"); // 添加一条初始历史记录，测试面板是否工作

          this.scheduleOnce(() => {
            this.gameStateManager.addHistoryItem({
              id: `init_history_${Date.now()}`,
              text: `游戏历史记录面板已初始化`,
              timestamp: Date.now(),
              type: 'system'
            });
          }, 1);
        }

        onDestroy() {
          // 移除事件监听
          this.gameStateManager.off('history-updated', this._onHistoryUpdatedCallback);
        }
        /**
         * 处理历史记录更新事件
         * @param data 事件数据 { items: HistoryItem[] }
         */


        handleHistoryUpdated(data) {
          console.log("[GameHistoryPanel] handleHistoryUpdated called. Items count:", data.items.length); // 确保 historyContent 和 historyItemPrefab 都已设置

          if (!this.historyContent || !this.historyItemPrefab) {
            console.error("[GameHistoryPanel] historyContent or historyItemPrefab is not set!");
            return;
          } // 从控制台输出所有历史项，便于调试


          console.log("[GameHistoryPanel] 所有历史记录项:", JSON.stringify(data.items.map(item => item.text)));
          this.historyContent.removeAllChildren(); // 清空现有历史

          data.items.forEach(item => {
            // 在实例化之前，再次确认 Prefab 不为 null
            if (!this.historyItemPrefab) {
              console.error("[GameHistoryPanel] historyItemPrefab is null inside loop!");
              return; // 如果 Prefab 为空，则无法继续处理此项
            } // 实例化 Prefab 得到 Node，并显式转换为 Node 类型


            const historyNodeInstance = instantiate(this.historyItemPrefab);

            if (!historyNodeInstance) {
              console.error("[GameHistoryPanel] Failed to instantiate historyItemPrefab!");
              return; // 跳过这个 item
            } // 在实例化的 Node 上查找 Label


            const labelNode = historyNodeInstance.getChildByName("HistoryLabel");
            const label = labelNode == null ? void 0 : labelNode.getComponent(Label);

            if (label) {
              label.string = item.text; // 使用 HistoryItem 的文本
              // 根据记录类型设置颜色

              switch (item.type) {
                case 'system':
                  label.color = new Color(150, 150, 150, 255); // 灰色

                  break;

                case 'bid':
                  label.color = new Color(255, 255, 255, 255); // 白色

                  break;

                case 'challenge':
                  label.color = new Color(255, 100, 100, 255); // 红色

                  break;

                case 'spot_on':
                  label.color = new Color(100, 255, 100, 255); // 绿色

                  break;

                default:
                  label.color = new Color(255, 255, 255, 255);
                // 默认白色
              }
            } else {
              console.error("[GameHistoryPanel] Failed to get Label component from instantiated history item's child 'HistoryLabel'!");
            } // 将实例化的 Node 添加到容器中


            if (this.historyContent) {
              // 再次检查 historyContent 是否有效
              this.historyContent.addChild(historyNodeInstance);
            }
          }); // 滚动到底部，显示最新的历史记录
          // 延迟到下一帧执行，确保布局已完全更新

          this.scheduleOnce(() => {
            if (this.scrollView) {
              console.log("[GameHistoryPanel] 尝试滚动到底部 (下一帧)");
              this.scrollView.scrollToBottom(0.1); // 0.1秒动画时间
            } else {
              var _this$node$getParent;

              console.log("[GameHistoryPanel] scrollView不存在，无法滚动到底部"); // 尝试从父节点获取ScrollView (备用逻辑，以防万一)

              const parentScrollView = this.node.getComponent(ScrollView) || ((_this$node$getParent = this.node.getParent()) == null ? void 0 : _this$node$getParent.getComponent(ScrollView));

              if (parentScrollView) {
                console.log("[GameHistoryPanel] 从父节点找到scrollView，尝试滚动到底部 (下一帧)");
                parentScrollView.scrollToBottom(0.1);
              }
            }
          }, 0); // 延迟0帧，即下一帧执行
        }
        /**
         * 清空历史记录
         */


        clearHistory() {
          if (this.historyContent) {
            this.historyContent.removeAllChildren();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "historyContent", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "historyItemPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scrollView", [_dec4], {
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
//# sourceMappingURL=237dc8e462bb54a7dda5701af54159d99427c85c.js.map