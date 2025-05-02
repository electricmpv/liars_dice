System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _class2, _crd, ccclass, property, LoginManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8dc9bga2dxLtYe/dmAE1aVs", "login-manager", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LoginManager", LoginManager = (_dec = ccclass('LoginManager'), _dec(_class = (_class2 = class LoginManager extends Component {
        // Add static property for player name
        static getInstance() {
          if (!LoginManager.instance) {
            LoginManager.instance = new LoginManager();
          }

          return LoginManager.instance;
        }
        /**
         * 用户名密码登录
         * 在Colyseus中，登录通常在加入房间时通过options传递凭据
         * @param username 用户名
         * @param password 密码
         * @param onSuccess 成功回调
         * @param onFailure 失败回调
         */


        login(username, password, onSuccess, onFailure) {
          try {
            // 存储用户名作为玩家名称
            LoginManager.playerName = username; // 生成临时ID（实际ID将在加入房间时由Colyseus分配）

            const tempId = `user_${Date.now()}`;
            LoginManager.currentPlayerId = tempId;
            console.log(`[LoginManager] 用户登录成功: ID=${tempId}, Name=${username}`); // 调用成功回调

            onSuccess();
          } catch (error) {
            console.error("[LoginManager] 用户登录处理错误:", error);
            onFailure(error instanceof Error ? error.message : "用户登录处理错误");
          }
        }
        /**
         * 游客登录
         * 在Colyseus中，游客登录只是生成一个临时ID和名称，实际连接在加入房间时进行
         * @param onSuccess 成功回调
         * @param onFailure 失败回调
         */


        guestLogin(onSuccess, onFailure) {
          try {
            // 检查是否已经有玩家名称
            if (!LoginManager.playerName) {
              // 生成随机游客名称
              LoginManager.playerName = `游客_${Math.floor(Math.random() * 10000)}`;
            } // 生成临时ID（实际ID将在加入房间时由Colyseus分配）


            const tempId = `guest_${Date.now()}`;
            LoginManager.currentPlayerId = tempId;
            console.log(`[LoginManager] 游客登录成功: ID=${tempId}, Name=${LoginManager.playerName}`); // 构造响应对象

            const response = {
              success: true,
              playerId: tempId,
              playerName: LoginManager.playerName
            }; // 立即调用成功回调

            onSuccess(response);
          } catch (error) {
            console.error("[LoginManager] 游客登录处理错误:", error);
            onFailure(error instanceof Error ? error.message : "游客登录处理错误");
          }
        }

      }, _class2.instance = void 0, _class2.currentPlayerId = null, _class2.playerName = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ec7698af004f050c93cf8ab05be3428812759efb.js.map