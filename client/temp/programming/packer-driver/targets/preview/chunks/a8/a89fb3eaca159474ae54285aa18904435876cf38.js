System.register(["cc", "shared/schemas/LiarDiceState"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_sharedSchemasLiarDiceState) {
      var _exportObj = {};

      for (var _key in _sharedSchemasLiarDiceState) {
        if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _sharedSchemasLiarDiceState[_key];
      }

      _export(_exportObj);
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1cf44UYoVpL2KzdQ8VLdF1N", "shared-exports", undefined); // client/assets/scripts/shared-exports.ts
      // Re-exporting necessary types/schemas from the actual shared directory
      // using the tsconfig path alias.


      // Use path alias
      // Add other exports from the shared directory here if needed, e.g.:
      // export * from 'shared/types/game-types';
      // export * from 'shared/protocols/game-protocol';
      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a89fb3eaca159474ae54285aa18904435876cf38.js.map