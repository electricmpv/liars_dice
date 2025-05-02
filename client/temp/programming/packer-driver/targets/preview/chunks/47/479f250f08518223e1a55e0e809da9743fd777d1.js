System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Prefab, instantiate, Color, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, PlayerDisplayController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfSharedPlayer(extras) {
    _reporterNs.report("SharedPlayer", "../../shared/protocols/room-protocol", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "799ed5FzWVES6x7e3geV+b5", "player-display-controller", undefined);

      // 移除不再需要的 PlayerItem 导入，除非 PlayerData 仍然依赖它（但看起来不依赖）
      // import { PlayerItem } from '../prefabs/player-item';
      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Prefab', 'instantiate', 'Color']);

      ({
        ccclass,
        property
      } = _decorator); // Import the shared Player type which includes isAI
      // Use the shared Player type or define a local one that includes isAI
      // Export the interface so it can be imported by other modules

      _export("PlayerDisplayController", PlayerDisplayController = (_dec = ccclass('PlayerDisplayController'), _dec2 = property(Node), _dec3 = property(Prefab), _dec(_class = (_class2 = class PlayerDisplayController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "playerInfoContainer", _descriptor, this);

          _initializerDefineProperty(this, "playerInfoPrefab", _descriptor2, this);

          this._playerInfoNodes = new Map();
          this._myPlayerId = '';
        }

        /**
         * 初始化玩家显示控制器
         * @param myPlayerId 当前玩家的ID
         */
        initialize(myPlayerId) {
          this._myPlayerId = myPlayerId;

          if (this.playerInfoContainer) {
            this.playerInfoContainer.removeAllChildren();

            this._playerInfoNodes.clear();
          } else {
            console.error("[PlayerDisplayController] playerInfoContainer is not set!");
          }
        }
        /**
         * 更新所有玩家的显示信息
         * @param players 玩家数据列表
         * @param currentPlayerId 当前回合玩家ID (可选，用于高亮)
         */


        updatePlayerDisplays(players, currentPlayerId) {
          if (!this.playerInfoContainer || !this.playerInfoPrefab) {
            console.error("[PlayerDisplayController] Container or Prefab not set!");
            return;
          } // 暂存旧节点，稍后移除未更新的


          var oldNodes = new Map(this._playerInfoNodes);

          this._playerInfoNodes.clear();

          players.forEach(player => {
            var playerNode = oldNodes.get(player.id); // 如果节点不存在，则创建新的

            if (!playerNode || !playerNode.isValid) {
              playerNode = instantiate(this.playerInfoPrefab);

              if (!playerNode) {
                console.error("[PlayerDisplayController] Failed to instantiate player info prefab for player:", player.id);
                return;
              }

              this.playerInfoContainer.addChild(playerNode);
            } else {
              // 从旧节点中移除，表示此节点已更新
              oldNodes.delete(player.id);
            }

            this._playerInfoNodes.set(player.id, playerNode); // 更新节点内容


            this.updateSinglePlayerDisplay(playerNode, player, currentPlayerId);
          }); // 移除不再存在的玩家节点

          oldNodes.forEach(node => {
            if (node && node.isValid) {
              node.destroy();
            }
          });
        }
        /**
         * 更新单个玩家的显示信息
         * @param playerNode 玩家对应的UI节点
         * @param playerData 玩家数据
         * @param currentPlayerId 当前回合玩家ID (可选)
         */


        updateSinglePlayerDisplay(playerNode, playerData, currentPlayerId) {
          var _playerNode$getChildB, _diceInfoNode$getChil;

          // 不再获取 PlayerItem 组件，因为 PlayerInfo prefab 没有挂载它
          var nameLabel = (_playerNode$getChildB = playerNode.getChildByName('NameLabel')) == null ? void 0 : _playerNode$getChildB.getComponent(Label); // 修正查找路径：PlayerInfo -> DiceInfo -> DiceCountLabel

          var diceInfoNode = playerNode.getChildByName('DiceInfo');
          var diceCountLabel = diceInfoNode == null || (_diceInfoNode$getChil = diceInfoNode.getChildByName('DiceCountLabel')) == null ? void 0 : _diceInfoNode$getChil.getComponent(Label); // const background = playerNode.getChildByName('Background'); // 用于高亮
          // 更新名字和颜色

          if (nameLabel) {
            nameLabel.string = playerData.id === this._myPlayerId ? playerData.name + " (\u4F60)" : playerData.name;
            nameLabel.color = playerData.id === this._myPlayerId ? new Color(255, 215, 0, 255) : Color.WHITE; // 自己金色，他人白色
          } // 更新骰子数量


          if (diceCountLabel) {
            diceCountLabel.string = "\u9AB0\u5B50: " + playerData.diceCount;
          } // 更新高亮状态 (可选)
          // const isCurrent = playerData.id === currentPlayerId;
          // if (background) {
          //     const sprite = background.getComponent(Sprite); // 或者其他表示高亮的组件
          //     if (sprite) {
          //         sprite.color = isCurrent ? new Color(100, 149, 237, 255) : new Color(50, 50, 50, 255); // 示例颜色
          //     }
          // }
          // --- 新增：直接控制 PlayerInfo 内部的子节点 ---
          // 控制 AI 图标 (假设 PlayerInfo prefab 内有一个名为 'AiIcon' 的节点)


          var aiIconNode = playerNode.getChildByName('AiIcon');

          if (aiIconNode) {
            aiIconNode.active = playerData.isAI;
          } else {// 首次运行时可能 prefab 还没更新，打印警告
            // console.warn(`[PlayerDisplayController] 'AiIcon' node not found in PlayerInfo for player ${playerData.id}`);
          } // 控制当前玩家指示器 (假设 PlayerInfo prefab 内有一个名为 'CurrentPlayerIndicator' 的节点)


          var currentPlayerIndicatorNode = playerNode.getChildByName('CurrentPlayerIndicator');

          if (currentPlayerIndicatorNode) {
            currentPlayerIndicatorNode.active = playerData.id === currentPlayerId;
          } else {// console.warn(`[PlayerDisplayController] 'CurrentPlayerIndicator' node not found in PlayerInfo for player ${playerData.id}`);
          } // 控制活跃玩家指示器 (假设 PlayerInfo prefab 内有一个名为 'ActiveIndicator' 的节点)
          // 注意：playerData 中目前没有 isActive 字段，需要从 GameState 或其他地方获取此信息
          // const isActivePlayer = ...; // 需要逻辑来判断玩家是否活跃
          // const activeIndicatorNode = playerNode.getChildByName('ActiveIndicator');
          // if (activeIndicatorNode) {
          //     activeIndicatorNode.active = isActivePlayer;
          // } else {
          //     // console.warn(`[PlayerDisplayController] 'ActiveIndicator' node not found in PlayerInfo for player ${playerData.id}`);
          // }
          // 控制离线指示器 (假设 PlayerInfo prefab 内有一个名为 'OfflineIndicator' 的节点)
          // 注意：playerData 中目前没有 isOnline 字段，需要从 GameState 或其他地方获取此信息
          // const isOnline = ...; // 需要逻辑来判断玩家是否在线
          // const offlineIndicatorNode = playerNode.getChildByName('OfflineIndicator');
          // if (offlineIndicatorNode) {
          //     offlineIndicatorNode.active = !isOnline;
          // } else {
          //     // console.warn(`[PlayerDisplayController] 'OfflineIndicator' node not found in PlayerInfo for player ${playerData.id}`);
          // }

        }
        /**
         * 根据玩家ID获取玩家名字（带"(你)"标识）
         * @param playerId 玩家ID
         * @returns 玩家名字字符串，如果找不到返回ID本身
         */


        getPlayerNameWithAlias(playerId) {
          var playerNode = this._playerInfoNodes.get(playerId);

          if (playerNode && playerNode.isValid) {
            var _playerNode$getChildB2;

            var nameLabel = (_playerNode$getChildB2 = playerNode.getChildByName('NameLabel')) == null ? void 0 : _playerNode$getChildB2.getComponent(Label);

            if (nameLabel) {
              return nameLabel.string; // 直接返回 Label 的内容，因为它已经包含了 "(你)"
            }
          } // Fallback: 如果节点或 Label 找不到，返回原始 ID


          return playerId;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "playerInfoContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "playerInfoPrefab", [_dec3], {
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
//# sourceMappingURL=479f250f08518223e1a55e0e809da9743fd777d1.js.map