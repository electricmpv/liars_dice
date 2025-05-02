System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BidValidator, _crd;

  function _reportPossibleCrUseOfBid(extras) {
    _reporterNs.report("Bid", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFace(extras) {
    _reporterNs.report("Face", "../../shared/protocols/game-types.d", _context.meta, extras);
  }

  _export("BidValidator", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "71b58RSbYtBR6tnyl8ZYfg3", "bid-validator", undefined);

      /**
       * 叫价验证器
       * 负责验证叫价是否合法，根据用户指定的规则：
       * - 1 被叫时，视为比 6 大的点数。
       * - 数量增加时，点数任意。
       * - 数量相同时，点数必须增加（考虑 1 > 6）。
       * - 达到 X 个 6 或 X 个 1 后，下一个必须是 X+1 个任意点数。
       */
      _export("BidValidator", BidValidator = class BidValidator {
        /**
         * 获取点数的有效比较值 (1 视为 7)
         * @param face 点数 (1-6) 或 0 (来自 [0,0])
         * @returns 比较值 (2-6, 或 7 代表 1) ，如果输入无效则返回 0
         */
        static getEffectiveValue(face) {
          if (face === 1) return 7; // 1 点视为 7

          if (face >= 2 && face <= 6) return face; // 2-6 不变

          return 0; // 处理无效输入或 [0,0] 中的 0
        }
        /**
         * 验证叫价是否合法
         * @param value 要叫的点数 (1-6)
         * @param count 要叫的数量
         * @param currentBid 当前最高叫价 [face, count] 或 [0, 0]
         * @param totalDice 场上总骰子数
         * @returns 是否合法
         */


        static isBidValid(value, count, currentBid, totalDice) {
          var [currentValueFace, currentCount] = currentBid; // 基本验证: 点数必须是 1-6, 数量必须大于 0 且不大于总骰子数

          if (!this.validFace(value) || count <= 0 || count > totalDice) {
            return false;
          } // 首次叫价 (currentCount 为 0) 总是有效的


          if (currentCount === 0) {
            return true;
          } // 获取当前叫价和新叫价的有效比较值


          var currentValue = this.getEffectiveValue(currentValueFace);
          var newValue = this.getEffectiveValue(value); // 新规则: 如果数量增加，叫价总是有效的

          if (count > currentCount) {
            return true;
          } // 新规则: 如果数量相同，新点数的有效值必须严格大于当前点数的有效值


          if (count === currentCount && newValue > currentValue) {
            return true;
          } // 其他情况 (数量更少，或数量相同但点数相同/更低) 均无效


          return false;
        }
        /**
         * 计算给定【选定点数】下，最小合法的叫价数量 (适配旧交互模式)
         * @param selectedValue 玩家选择的点数 (1-6)
         * @param currentBid 当前最高叫价 [face, count] 或 [0, 0]
         * @returns 最小合法数量
         */


        static getMinValidCount(selectedValue, currentBid) {
          var [currentValueFace, currentCount] = currentBid; // 首次叫价，最小数量为 1

          if (currentCount === 0) {
            return 1;
          } // 获取当前叫价和选定点数的有效比较值


          var currentValue = this.getEffectiveValue(currentValueFace);
          var newValue = this.getEffectiveValue(selectedValue); // 新规则: 如果选定点数的有效值 > 当前点数的有效值，可以保持相同数量

          if (newValue > currentValue) {
            return currentCount;
          } else {
            // 新规则: 如果选定点数的有效值 <= 当前点数的有效值，必须增加数量
            return currentCount + 1;
          }
        }
        /**
         * 计算给定【选定数量】下，最小合法的叫价点数 (适配新交互模式)
         * @param selectedCount 玩家选择的数量
         * @param currentBid 当前最高叫价 [face, count] 或 [0, 0]
         * @returns 最小合法点数 (1-6)。如果此数量下无合法点数 (意味着必须加数量)，返回 7。
         */


        static getMinValidFace(selectedCount, currentBid) {
          var [currentValueFace, currentCount] = currentBid; // 首次叫价，最小点数是 1

          if (currentCount === 0) {
            return 1;
          } // 新规则: 如果选定数量 > 当前数量，可以叫任意点数 (最小是 1)


          if (selectedCount > currentCount) {
            return 1;
          } // 新规则: 如果选定数量 === 当前数量，必须叫一个有效值更大的点数


          if (selectedCount === currentCount) {
            var currentValue = this.getEffectiveValue(currentValueFace); // 从 1 开始查找第一个有效值大于 currentValue 的点数

            for (var nextFace = 1; nextFace <= 6; nextFace++) {
              if (this.getEffectiveValue(nextFace) > currentValue) {
                return nextFace; // 找到最小的合法点数
              }
            } // 如果循环结束还没找到，说明当前已经是最大有效值 (X 个 1)，必须增加数量


            return 7; // 返回 7 表示此数量下无合法点数
          } // 理论上 UI 不会允许选择比当前数量更小的数量


          console.error("getMinValidFace called with selectedCount lower than currentCount", selectedCount, currentBid);
          return 7; // 错误情况
        }
        /**
         * 验证值是否为有效的骰子面值 (1-6)
         * @param value 要验证的值
         * @returns 是否为有效面值
         */


        static validFace(value) {
          return value >= 1 && value <= 6;
        }
        /**
         * 获取骰子面值标签
         * @param face 骰子面值 (1-6)
         * @returns 面值标签
         */


        static getFaceLabel(face) {
          // 根据之前的上下文使用中文标签
          return ["?", "一", "二", "三", "四", "五", "六"][face] || "" + face;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5774a61aa2ff3244ef49216109b578abb1e55ca2.js.map