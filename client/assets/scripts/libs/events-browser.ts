/**
 * 浏览器环境中的事件模块模拟
 * 为Colyseus提供兼容性支持
 */

// 创建全局EventEmitter类
export class EventEmitter {
  private _events: Record<string, Function[]> = {};
  private _eventsCount = 0;
  private _maxListeners = 10;

  constructor() {
    this._events = {};
    this._eventsCount = 0;
  }

  setMaxListeners(n: number): this {
    this._maxListeners = n;
    return this;
  }

  getMaxListeners(): number {
    return this._maxListeners;
  }

  eventNames(): string[] {
    return Object.keys(this._events);
  }

  listeners(type: string): Function[] {
    const events = this._events;
    return events[type] ? [...events[type]] : [];
  }

  listenerCount(type: string): number {
    const events = this._events;
    return events[type] ? events[type].length : 0;
  }

  emit(type: string, ...args: any[]): boolean {
    const events = this._events;
    if (!events[type]) return false;

    const handlers = events[type];
    handlers.forEach(handler => {
      handler.apply(this, args);
    });

    return true;
  }

  on(type: string, listener: Function): this {
    return this.addListener(type, listener);
  }

  addListener(type: string, listener: Function): this {
    const events = this._events;
    
    if (!events[type]) {
      events[type] = [];
      this._eventsCount++;
    }
    
    events[type].push(listener);
    
    return this;
  }

  once(type: string, listener: Function): this {
    const onceWrapper = (...args: any[]) => {
      this.removeListener(type, onceWrapper);
      listener.apply(this, args);
    };
    
    this.on(type, onceWrapper);
    return this;
  }

  off(type: string, listener: Function): this {
    return this.removeListener(type, listener);
  }

  removeListener(type: string, listener: Function): this {
    const events = this._events;
    if (!events[type]) return this;

    events[type] = events[type].filter(l => l !== listener);
    
    if (events[type].length === 0) {
      delete events[type];
      this._eventsCount--;
    }
    
    return this;
  }

  removeAllListeners(type?: string): this {
    const events = this._events;
    
    if (type) {
      if (events[type]) {
        delete events[type];
        this._eventsCount--;
      }
    } else {
      this._events = {};
      this._eventsCount = 0;
    }
    
    return this;
  }
}

// 导出全局EventEmitter
(window as any).EventEmitter = EventEmitter;

// 导出模拟的events模块接口
const events = {
  EventEmitter
};

// 确保全局可访问
(window as any).events = events;
(window as any).require = function(name: string) {
  if (name === 'events') {
    return events;
  }
  throw new Error(`Cannot find module '${name}'`);
};

export default events;
