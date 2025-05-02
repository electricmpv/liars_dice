System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, FaceValue, PlayerValue;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8799aSnI15BBKgSsM4JNgy0", "game-values", undefined);

      /**
       * 吹牛骰子游戏值定义
       * 提供枚举值供游戏逻辑使用
       */
      // 骰子面值枚举，与类型定义对应
      _export("FaceValue", FaceValue = /*#__PURE__*/function (FaceValue) {
        FaceValue[FaceValue["One"] = 1] = "One";
        FaceValue[FaceValue["Two"] = 2] = "Two";
        FaceValue[FaceValue["Three"] = 3] = "Three";
        FaceValue[FaceValue["Four"] = 4] = "Four";
        FaceValue[FaceValue["Five"] = 5] = "Five";
        FaceValue[FaceValue["Six"] = 6] = "Six";
        return FaceValue;
      }({})); // 玩家特殊标识


      _export("PlayerValue", PlayerValue = /*#__PURE__*/function (PlayerValue) {
        PlayerValue[PlayerValue["Yourself"] = 0] = "Yourself";
        PlayerValue[PlayerValue["EmptyPlayer"] = -1] = "EmptyPlayer";
        return PlayerValue;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1394e67abeeb3cc0a6c38003c7cb157d271aabd9.js.map