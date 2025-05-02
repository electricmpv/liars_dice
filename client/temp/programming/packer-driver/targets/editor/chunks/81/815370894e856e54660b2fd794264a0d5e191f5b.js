System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, find, AppInitializer, _dec, _class, _crd, ccclass, property, SceneInitializer;

  function _reportPossibleCrUseOfAppInitializer(extras) {
    _reporterNs.report("AppInitializer", "./app-initializer", _context.meta, extras);
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
      director = _cc.director;
      find = _cc.find;
    }, function (_unresolved_2) {
      AppInitializer = _unresolved_2.AppInitializer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cf0b3WeLBZFnZe69QNdTjJq", "scene-initializer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Node', 'find']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * 场景初始化器
       * 负责在场景加载时执行必要的初始化操作
       * 此组件应添加到每个场景的Canvas节点上
       */

      _export("SceneInitializer", SceneInitializer = (_dec = ccclass('SceneInitializer'), _dec(_class = class SceneInitializer extends Component {
        start() {
          var _director$getScene, _director$getScene2;

          console.log(`[SceneInitializer] 初始化场景: ${(_director$getScene = director.getScene()) == null ? void 0 : _director$getScene.name}`); // 如果是LoginScene，确保AppInitializer已添加

          if (((_director$getScene2 = director.getScene()) == null ? void 0 : _director$getScene2.name) === 'LoginScene') {
            this.ensureAppInitializer();
          }
        }
        /**
         * 确保AppInitializer已添加到Canvas节点
         */


        ensureAppInitializer() {
          // 获取Canvas节点
          const canvas = find('Canvas');

          if (!canvas) {
            console.error('[SceneInitializer] 找不到Canvas节点');
            return;
          } // 检查是否已有AppInitializer组件


          let appInitializer = canvas.getComponent(_crd && AppInitializer === void 0 ? (_reportPossibleCrUseOfAppInitializer({
            error: Error()
          }), AppInitializer) : AppInitializer);

          if (!appInitializer) {
            console.log('[SceneInitializer] 添加AppInitializer组件到Canvas节点');
            appInitializer = canvas.addComponent(_crd && AppInitializer === void 0 ? (_reportPossibleCrUseOfAppInitializer({
              error: Error()
            }), AppInitializer) : AppInitializer);
          } else {
            console.log('[SceneInitializer] Canvas节点已有AppInitializer组件');
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=815370894e856e54660b2fd794264a0d5e191f5b.js.map