System.register([], function (_export, _context) {
  "use strict";

  var FaceValue, PlayerValue;
  return {
    setters: [],
    execute: function () {
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
    }
  };
});
//# sourceMappingURL=4d17fe2b55cf0b56158e0786f70ee4a872f18b98.js.map