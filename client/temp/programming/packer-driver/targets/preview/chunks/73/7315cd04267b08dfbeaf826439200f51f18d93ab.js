System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, Sprite, Label, Color, resources, SpriteFrame, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, DiceDisplayController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/protocols/game-types.d", _context.meta, extras);
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
      Sprite = _cc.Sprite;
      Label = _cc.Label;
      Color = _cc.Color;
      resources = _cc.resources;
      SpriteFrame = _cc.SpriteFrame;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d11402qUj1A6bN4la7vjlAd", "dice-display-controller", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Sprite', 'Label', 'Color', 'resources', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 骰子显示控制器
       * 负责显示玩家的骰子
       */

      _export("DiceDisplayController", DiceDisplayController = (_dec = ccclass('DiceDisplayController'), _dec2 = property(Node), _dec3 = property(Prefab), _dec(_class = (_class2 = class DiceDisplayController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "dicesContainer", _descriptor, this);

          _initializerDefineProperty(this, "diceSpritePrefab", _descriptor2, this);
        }

        /**
         * 显示骰子
         * @param dices 骰子数组
         */
        displayDices(dices) {
          console.log("[DiceDisplayController] displayDices called. Dices:", JSON.stringify(dices));

          if (!this.diceSpritePrefab) {
            console.error("[DiceDisplayController] Dice sprite prefab is not set!");
            return;
          }

          if (!this.dicesContainer) {
            console.warn("[DiceDisplayController] Dice container is not set.");
            return;
          }

          this.dicesContainer.removeAllChildren();
          dices.forEach(faceValue => {
            var diceNode = instantiate(this.diceSpritePrefab);

            if (!diceNode || !(diceNode instanceof Node)) {
              console.error("[DiceDisplayController] Failed to instantiate dice prefab for value: " + faceValue);
              return;
            }

            var sprite = diceNode.getComponent(Sprite);

            if (sprite) {
              var dirPath = 'textures/dice';
              var spriteFrameName = "dice_" + faceValue;
              resources.loadDir(dirPath, SpriteFrame, (err, spriteFrames) => {
                if (!diceNode || !diceNode.isValid || !sprite || !sprite.isValid) return;

                if (err) {
                  console.error("[DiceDisplayController] Failed to load dice directory: " + dirPath, err);
                  sprite.spriteFrame = null;
                  return;
                }

                var spriteFrame = spriteFrames.find(sf => sf.name === spriteFrameName);

                if (!spriteFrame) {
                  console.warn("[DiceDisplayController] SpriteFrame '" + spriteFrameName + "' not found in '" + dirPath + "'");
                  sprite.spriteFrame = null;
                  return;
                }

                sprite.spriteFrame = spriteFrame;
              });
            } else {
              console.warn("[DiceDisplayController] Dice prefab is missing Sprite component.");
              var label = diceNode.getComponent(Label) || diceNode.addComponent(Label);
              label.string = "" + faceValue;
              label.color = Color.BLACK;
              label.fontSize = 20;
              label.horizontalAlign = Label.HorizontalAlign.CENTER;
              label.verticalAlign = Label.VerticalAlign.CENTER;
            }

            if (this.dicesContainer && diceNode.isValid) {
              this.dicesContainer.addChild(diceNode);
            } else if (diceNode && !diceNode.isValid) {
              diceNode.destroy();
            }
          });
        }
        /**
         * 清空骰子显示
         */


        clearDices() {
          if (this.dicesContainer) {
            this.dicesContainer.removeAllChildren();
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dicesContainer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "diceSpritePrefab", [_dec3], {
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
//# sourceMappingURL=7315cd04267b08dfbeaf826439200f51f18d93ab.js.map