import { _decorator, Component } from 'cc';
import { NetworkManager } from './network';

const { ccclass, property } = _decorator;

@ccclass('LoginManager')
export class LoginManager extends Component {
    private static instance: LoginManager;
    public static currentPlayerId: string | null = null; // 添加静态属性存储玩家ID

    public static getInstance(): LoginManager {
        if (!LoginManager.instance) {
            LoginManager.instance = new LoginManager();
        }
        return LoginManager.instance;
    }

    public login(username: string, password: string, onSuccess: () => void, onFailure: (error: string) => void): void {
        NetworkManager.getInstance().request('login', { username, password })
            .then((response) => {
                if (response.success) {
                    console.log("登录成功:", response);
                    onSuccess();
                } else {
                    console.error("登录失败:", response.error);
                    onFailure(response.error || "登录失败");
                }
            })
            .catch((error) => {
                console.error("登录请求错误:", error);
                onFailure(error.message);
            });
    }

    // 修改 onSuccess 的类型签名以接收响应
    public guestLogin(onSuccess: (response: any) => void, onFailure: (error: string) => void): void {
        NetworkManager.getInstance().request('guestLogin', {})
            .then((response) => {
                if (response.success) {
                    console.log("游客登录成功:", response);
                    onSuccess(response); // 将 response 传递给回调
                } else {
                    console.error("游客登录失败:", response.error);
                    onFailure(response.error || "游客登录失败");
                }
            })
            .catch((error) => {
                console.error("游客登录请求错误:", error);
                onFailure(error.message);
            });
    }
}
