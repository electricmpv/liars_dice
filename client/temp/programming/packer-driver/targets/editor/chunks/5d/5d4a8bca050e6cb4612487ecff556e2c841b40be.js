System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Color, Button, PlayerDisplayController, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, GameResultPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayerDisplayController(extras) {
    _reporterNs.report("PlayerDisplayController", "./player-display-controller", _context.meta, extras);
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
      Label = _cc.Label;
      Color = _cc.Color;
      Button = _cc.Button;
    }, function (_unresolved_2) {
      PlayerDisplayController = _unresolved_2.PlayerDisplayController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "78915Gh27BKdY284PpPDEU0", "game-result-panel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Color', 'Button']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 游戏结果面板
       * 负责显示游戏结束结果
       */

      _export("GameResultPanel", GameResultPanel = (_dec = ccclass('GameResultPanel'), _dec2 = property(Label), _dec3 = property(Label), _dec4 = property(Button), _dec5 = property(_crd && PlayerDisplayController === void 0 ? (_reportPossibleCrUseOfPlayerDisplayController({
        error: Error()
      }), PlayerDisplayController) : PlayerDisplayController), _dec(_class = (_class2 = class GameResultPanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "winnerLabel", _descriptor, this);

          _initializerDefineProperty(this, "finalScoreLabel", _descriptor2, this);

          _initializerDefineProperty(this, "backToLobbyButton", _descriptor3, this);

          _initializerDefineProperty(this, "playerDisplayController", _descriptor4, this);
        }

        onLoad() {
          // 初始隐藏面板
          this.node.active = false; // 设置返回大厅按钮点击事件

          if (this.backToLobbyButton) {
            this.backToLobbyButton.node.on('click', this.onBackToLobbyClick, this);
          }
        }

        onDestroy() {
          var _this$backToLobbyButt;

          // // 移除按钮点击事件
          // if (this.backToLobbyButton) {
          //     this.backToLobbyButton.node.off('click', this.onBackToLobbyClick, this);
          // }
          // 移除按钮点击事件，防止访问已销毁的节点
          const btnNode = (_this$backToLobbyButt = this.backToLobbyButton) == null ? void 0 : _this$backToLobbyButt.node;

          if (btnNode) {
            btnNode.off('click', this.onBackToLobbyClick, this);
          }
        }
        /**
         * 显示游戏结果
         * @param data 游戏结束数据 { winner, players }
         */


        showResult(data) {
          console.log("[GameResultPanel] showResult called with data:", JSON.stringify(data)); // 显示面板

          console.log(`[GameResultPanel] Setting node active: true. Current active state: ${this.node.active}`);
          this.node.active = true;
          console.log(`[GameResultPanel] Node active state after setting: ${this.node.active}`);
          console.log(`[GameResultPanel] Node activeInHierarchy state after setting: ${this.node.activeInHierarchy}`); // 显示获胜者

          if (this.winnerLabel) {
            var _this$playerDisplayCo;

            const winnerName = ((_this$playerDisplayCo = this.playerDisplayController) == null ? void 0 : _this$playerDisplayCo.getPlayerNameWithAlias(data.winner)) || data.winner;
            this.winnerLabel.string = `${winnerName} 获胜!`;
            this.winnerLabel.color = new Color(255, 215, 0, 255);
          } // 计算并显示最终得分


          this.calculateAndShowFinalScore(data);
        }
        /**
         * 计算并显示最终得分
         * @param data 游戏结束数据 { winner, players }
         */


        calculateAndShowFinalScore(data) {
          console.log("[GameResultPanel] calculateAndShowFinalScore called.");

          if (!this.finalScoreLabel) {
            console.error("[GameResultPanel] finalScoreLabel is not assigned!");
            return;
          }

          if (!data || !data.players || !Array.isArray(data.players)) {
            console.error("[GameResultPanel] Invalid or missing players data in calculateAndShowFinalScore:", data);
            this.finalScoreLabel.string = "错误：无法加载得分";
            return;
          }

          console.log("[GameResultPanel] Received players data:", JSON.stringify(data.players));
          let scoreText = "最终得分:\n";
          const sortedPlayers = [...data.players].sort((a, b) => {
            if (a.id === data.winner) return -1;
            if (b.id === data.winner) return 1;
            return b.diceCount - a.diceCount; // Sort by dice count descending (winner handled first)
          });
          console.log("[GameResultPanel] Sorted players data:", JSON.stringify(sortedPlayers));
          sortedPlayers.forEach((player, index) => {
            var _this$playerDisplayCo2;

            // Ensure player object and id exist
            if (!player || typeof player.id === 'undefined') {
              console.error("[GameResultPanel] Invalid player object in sortedPlayers:", player);
              scoreText += `${index + 1}. 无效玩家数据\n`;
              return; // Skip this player
            }

            const playerName = ((_this$playerDisplayCo2 = this.playerDisplayController) == null ? void 0 : _this$playerDisplayCo2.getPlayerNameWithAlias(player.id)) || `玩家 ${player.id.substring(0, 4)}`;
            const diceCount = typeof player.diceCount === 'number' ? player.diceCount : '?'; // Handle missing diceCount

            scoreText += `${index + 1}. ${playerName}: ${diceCount} 骰子\n`;
          });
          console.log("[GameResultPanel] Final score text:", scoreText);
          this.finalScoreLabel.string = scoreText;
        }
        /**
         * 处理返回大厅按钮点击
         */


        onBackToLobbyClick() {
          console.log("[GameResultPanel] onBackToLobbyClick called."); // 发出事件让上层管理器处理场景切换

          this.node.emit('back-to-lobby-requested');
        }
        /**
         * 隐藏结果面板
         */


        hidePanel() {
          this.node.active = false;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "winnerLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "finalScoreLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "backToLobbyButton", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "playerDisplayController", [_dec5], {
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
//# sourceMappingURL=5d4a8bca050e6cb4612487ecff556e2c841b40be.js.map