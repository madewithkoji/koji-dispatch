// tslint:disable: variable-name

import Sockette from 'sockette';
import { Config, ConfigOptions, DefaultOptions } from './Config';

export interface EventHandler {
  eventName: string;
  callback: (payload: {[index: string]: any}) => void;
}

export interface ShardInfo {
  shardName: string;
  numConnectedClients: number;
}

export enum DISPATCH_EVENT {
  CONNECTED = '@@KOJI_DISPATCH/CONNECTED',
  CONNECTED_CLIENTS_CHANGED = '@@KOJI_DISPATCH/CONNECTED_CLIENTS_CHANGED',
};

export default class Dispatch {
  private readonly config: Config;
  private readonly options: ConfigOptions;

  private ws: Sockette|null = null;

  private messageQueue: string[] = [];
  private eventHandlers: EventHandler[] = [];

  // User ID is given to us on connection
  private _clientId: string|null = null;
  public get clientId(): string|null {
    return this._clientId;
  }

  private _shardName: string|null = null;
  public get shardName(): string|null {
    return this._shardName;
  }

  private _userInfo: {[index: string]: any} = {};
  public get userInfo(): {[index: string]: any} {
    return this._userInfo;
  }

  private _connectedClients: {[index: string]: any}[] = [];
  public get connectedClients(): {[index: string]: any}[] {
    return this._connectedClients;
  }

  constructor(config: Config) {
    this.config = config;
    this.options = {
      ...DefaultOptions,
      projectId: config.projectId,
      ...this.config.options,
    };
  }

  async info(): Promise<ShardInfo[]> {
    const request = await fetch(`https://dispatch-info.api.gokij.com/info/${this.config.projectId}`);
    const result = await request.json();
    return result;
  }

  async connect() {
    if (this.ws) {
      return;
    }

    const baseUrl = 'wss://dispatch.api.gokoji.com/';
    const params: string[] = Object.keys(this.options).reduce((acc: string[], cur) => {
      if (this.options[cur]) {
        acc.push(`${cur}=${encodeURIComponent(this.options[cur])}`);
      }
      return acc;
    }, []);

    const url = `${baseUrl}?${params.join('&')}`;

    // Create a socket connection to the dispatch server
    this.ws = new Sockette(url, {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e) => {
        console.info('[Koji Dispatch] Connected');
        if (this.messageQueue.length > 0) {
          console.info(`[Koji Dispatch] Flushing ${this.messageQueue.length} enqueued message(s)`);
          this.messageQueue.reduce((acc, cur) => {
            if (this.ws) {
              this.ws.send(cur);
            }
            return acc;
          }, []);
        }
      },
      onmessage: (e) => {
        try {
          const { eventName, payload } = JSON.parse(e.data);
          // Handle Koji scoped messages
          if (eventName === DISPATCH_EVENT.CONNECTED) {
            this._clientId = payload.clientId;
            this._shardName = payload.shardName;
          }
          if (eventName === DISPATCH_EVENT.CONNECTED_CLIENTS_CHANGED) {
            this._connectedClients = payload.connectedClients;
          }

          // Handle custom messages
          this.eventHandlers.forEach((handler) => {
            if (eventName === handler.eventName) {
              handler.callback(payload);
            }
          });
        } catch (err) {
          console.log('[Koji Dispatch] error parsing message');
        }
      },
      onreconnect: (e) => {
        console.log('[Koji Dispatch] reconnected');
      },
      onmaximum: (e) => {
        //
      },
      onclose: (e) => {
        console.log('[Koji Dispatch] closed connection');
      },
      onerror: (e) => {
        console.error('[Koji Dispatch] error', e);
      },
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = null;
  }

  on(eventName: DISPATCH_EVENT|string, callback: (payload: {[index: string]: any}) => void) {
    this.eventHandlers.push({
      eventName,
      callback,
    });
  }

  removeEventListener(eventName: string) {
    this.eventHandlers = this.eventHandlers.filter(handler => handler.eventName !== eventName);
  }

  emitEvent(eventName: string, payload: {[index: string]: any}) {
    const message = JSON.stringify({
      eventName,
      payload,
    });

    if (message.length > 128e3) {
      // Discard a long message
      throw new Error('Message is too long to be sent through Koji Dispatch. Messages must be less than 128kb');
    }

    if (!this.ws) {
      // Socket is not connected, add to queue to be flushed once the socket
      // conects
      this.messageQueue.push(message);
    } else {
      this.ws.send(message);
    }
  }

  setUserInfo(userInfo: {[index: string]: any}) {
    this._userInfo = userInfo;
    this.emitEvent('@@KOJI_DISPATCH/SET_USER_INFO', this._userInfo);
  }
}
