/**
 * 浏览器环境中的Node.js核心模块模拟
 * 为Colyseus提供兼容性支持
 */

// 为浏览器环境添加全局require函数
if (typeof window !== 'undefined' && typeof (window as any).require === 'undefined') {
  (window as any).require = function(name: string) {
    if (nodeModules[name]) {
      return nodeModules[name];
    }
    
    throw new Error(`Current environment does not provide a require() for requiring '${name}'`);
  };
}

// 提供基本的Node.js模块模拟
const nodeModules: Record<string, any> = {
  // 模拟crypto模块
  crypto: {
    // 提供基本的随机数生成功能
    randomBytes: (size: number) => {
      const array = new Uint8Array(size);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(array);
      } else {
        // 降级方案，不够安全但可以工作
        for (let i = 0; i < size; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
      }
      return array;
    },
    createHash: (algorithm: string) => {
      console.warn(`crypto.createHash('${algorithm}') is not fully supported in browser environment`);
      return {
        update: (data: any) => {
          return {
            digest: (encoding: string) => {
              // 简单实现，仅用于兼容性
              if (encoding === 'hex') {
                return Array.from(new TextEncoder().encode(String(data)))
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join('');
              }
              return new TextEncoder().encode(String(data));
            }
          };
        }
      };
    },
    createHmac: (algorithm: string, key: any) => {
      console.warn(`crypto.createHmac('${algorithm}') is not fully supported in browser environment`);
      return {
        update: (data: any) => {
          return {
            digest: (encoding: string) => {
              // 简单实现，仅用于兼容性
              if (encoding === 'hex') {
                return Array.from(new TextEncoder().encode(String(data)))
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join('');
              }
              return new TextEncoder().encode(String(data));
            }
          };
        }
      };
    }
  },
  // events: { ... } // Removed custom events polyfill, rely on installed 'events' package
  
  // 空模拟的https模块
  https: {
    request: () => {
      console.warn('https.request is not supported in browser environment');
      return null;
    },
    get: () => {
      console.warn('https.get is not supported in browser environment');
      return null;
    },
    Agent: class Agent {
      constructor() {
        console.warn('https.Agent is not supported in browser environment');
      }
    }
  },
  
  // 空模拟的http模块
  http: {
    request: () => {
      console.warn('http.request is not supported in browser environment');
      return null;
    },
    get: () => {
      console.warn('http.get is not supported in browser environment');
      return null;
    },
    Agent: class Agent {
      constructor() {
        console.warn('http.Agent is not supported in browser environment');
      }
    }
  },
  
  // 空模拟的net模块
  net: {
    Socket: class Socket {
      constructor() {
        console.warn('net.Socket is not supported in browser environment');
      }
      
      connect() {
        console.warn('net.Socket.connect is not supported in browser environment');
        return this;
      }
      
      on() {
        console.warn('net.Socket.on is not supported in browser environment');
        return this;
      }
      
      write() {
        console.warn('net.Socket.write is not supported in browser environment');
        return false;
      }
      
      end() {
        console.warn('net.Socket.end is not supported in browser environment');
      }
    }
  },
  
  // 空模拟的tls模块
  tls: {
    connect: () => {
      console.warn('tls.connect is not supported in browser environment');
      return null;
    }
  },
  
  // 空模拟的buffer模块
  buffer: {
    Buffer: {
      from: (data: any) => {
        if (typeof data === 'string') {
          return new TextEncoder().encode(data);
        }
        return new Uint8Array(data);
      },
      alloc: (size: number) => new Uint8Array(size),
      isBuffer: (obj: any) => obj instanceof Uint8Array
    }
  },
  
  // 空模拟的url模块
  url: {
    parse: (urlString: string) => new URL(urlString),
    resolve: (from: string, to: string) => new URL(to, from).toString()
  },
  
  // 空模拟的querystring模块
  querystring: {
    stringify: (obj: Record<string, any>) => {
      return Object.keys(obj)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join('&');
    },
    parse: (str: string) => {
      const result: Record<string, string> = {};
      str.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        result[decodeURIComponent(key)] = decodeURIComponent(value);
      });
      return result;
    }
  },
  
  // 空模拟的path模块 
  path: {
    join: (...paths: string[]) => paths.join('/').replace(/\/+/g, '/'),
    resolve: (...paths: string[]) => paths.join('/').replace(/\/+/g, '/')
  }
};

// // 模拟Node.js的require函数 - REMOVED as it might interfere
// (window as any).require = function(name: string) {
//   if (nodeModules[name]) {
//     return nodeModules[name];
//   }
  
//   console.error(`模块 '${name}' 在浏览器环境中不可用`);
//   throw new Error(`Cannot find module '${name}'`);
// };

export default nodeModules;
