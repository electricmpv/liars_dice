import { _decorator, Component, Node, EditBox, Button, Label, director } from 'cc'; // 导入 director
import { LoginManager } from '../core/login-manager';
import { NetworkManager, ConnectionStatus } from '../core/network'; // 导入 NetworkManager 和 ConnectionStatus

const { ccclass, property } = _decorator;

@ccclass('LoginUI')
export class LoginUI extends Component {
@property(EditBox)
usernameInput: EditBox | null = null;

@property(EditBox)
passwordInput: EditBox | null = null;

@property(Button)
loginButton: Button | null = null;

@property(Button)
guestLoginButton: Button | null = null;

@property(Label)
statusLabel: Label | null = null;

    start() {
if (this.loginButton) {
    this.loginButton.node.on(Button.EventType.CLICK, this.onLogin, this);
}
if (this.guestLoginButton) {
    this.guestLoginButton.node.on(Button.EventType.CLICK, this.onGuestLogin, this);
}
    }

    async onLogin() { // 改为 async 方法
        if (!this.usernameInput || !this.passwordInput || !this.statusLabel) {
            console.error("UI 元素未正确配置");
            return;
        }

        const username = this.usernameInput.string;
        const password = this.passwordInput.string;

        if (!username || !password) {
            this.statusLabel.string = '请输入用户名和密码';
            return;
        }

        this.statusLabel.string = '处理中...'; // 提示用户正在处理
        this.setButtonsInteractable(false); // 禁用按钮防止重复点击

        try {
            // 检查连接状态，仅在 DISCONNECTED 或 ERROR 时连接
            const currentStatus = NetworkManager.getInstance().getConnectionStatus();
            if (currentStatus === ConnectionStatus.DISCONNECTED || currentStatus === ConnectionStatus.ERROR) {
                this.statusLabel.string = '正在连接服务器...';
                await NetworkManager.getInstance().connect(); // 等待连接成功
                this.statusLabel.string = '连接成功，正在登录...';
            } else {
                 this.statusLabel.string = '正在登录...';
            }

            // 连接成功后执行登录
            LoginManager.getInstance().login(username, password, this.onLoginSuccess.bind(this), this.onLoginFailure.bind(this));

        } catch (error: any) {
            // 连接或登录过程中发生错误
            console.error("连接或登录失败:", error);
            this.onLoginFailure(error.message || "连接或登录时发生错误");
            this.setButtonsInteractable(true); // 发生错误时重新启用按钮
        }
    }

    async onGuestLogin() { // 改为 async 方法
        if (!this.statusLabel) {
            console.error("UI 元素未正确配置");
            return;
        }

        this.statusLabel.string = '处理中...'; // 提示用户正在处理
        this.setButtonsInteractable(false); // 禁用按钮防止重复点击

        try {
            // 检查连接状态，仅在 DISCONNECTED 或 ERROR 时连接
            const currentStatus = NetworkManager.getInstance().getConnectionStatus();
            if (currentStatus === ConnectionStatus.DISCONNECTED || currentStatus === ConnectionStatus.ERROR) {
                this.statusLabel.string = '正在连接服务器...';
                await NetworkManager.getInstance().connect(); // 等待连接成功
                this.statusLabel.string = '连接成功，正在登录...';
            } else {
                 this.statusLabel.string = '正在登录...';
            }

            // 连接成功后执行游客登录，并处理响应
            LoginManager.getInstance().guestLogin(
                (response: any) => { // 修改回调以接收响应
                    if (response && response.playerId) {
                        LoginManager.currentPlayerId = response.playerId; // 存储 Player ID
                        console.log(`[LoginUI] Player ID stored: ${LoginManager.currentPlayerId}`);
                        this.onLoginSuccess(); // 调用原始的成功处理
                    } else {
                        console.error("[LoginUI] Guest login response missing playerId:", response);
                        this.onLoginFailure("游客登录响应无效");
                    }
                },
                this.onLoginFailure.bind(this)
            );

        } catch (error: any) {
            // 连接或登录过程中发生错误
            console.error("连接或游客登录失败:", error);
            this.onLoginFailure(error.message || "连接或游客登录时发生错误");
            this.setButtonsInteractable(true); // 发生错误时重新启用按钮
        }
    }

    onLoginSuccess() {
        if (this.statusLabel) {
            this.statusLabel.string = '登录成功';
        }
        // 登录成功后加载大厅场景
        director.loadScene('LobbyScene', (err) => {
            if (err) {
                console.error("加载 LobbyScene 失败:", err);
                if (this.statusLabel) {
                    this.statusLabel.string = `加载大厅失败: ${err.message}`;
                }
                this.setButtonsInteractable(true); // 加载失败时也应恢复按钮
            } else {
                console.log("成功加载 LobbyScene");
                // 成功加载后无需恢复按钮，因为场景已切换
            }
        });
    }

    onLoginFailure(error: string) {
        if (this.statusLabel) {
            this.statusLabel.string = `登录失败: ${error}`;
        }
        this.setButtonsInteractable(true); // 登录失败时恢复按钮交互
    }

    /**
     * 设置登录和游客按钮的可交互状态
     * @param interactable 是否可交互
     */
    private setButtonsInteractable(interactable: boolean): void {
        if (this.loginButton) {
            this.loginButton.interactable = interactable;
        }
        if (this.guestLoginButton) {
            this.guestLoginButton.interactable = interactable;
        }
    }
}
