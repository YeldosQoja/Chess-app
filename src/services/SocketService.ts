import { SocketData, Move, Promotion } from "@/models";

export class SocketService {
  private ws: WebSocket;
  private listeners: {
    [key: string]: ((data: any) => void)[];
  } = {};
  private errorListeners: ((e: Event) => void)[] = [];

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (e) => {
      const data = this.deserializeJSON(e.data);
      const { type } = data;
      if (this.listeners.hasOwnProperty(type)) {
        const callbacks = this.listeners[type];
        callbacks.forEach((cb) => {
          cb(data);
        });
      }
    };
    this.ws.onerror = (e) => {
      this.errorListeners.forEach((cb) => {
        cb(e);
      });
    };
  }

  private deserializeJSON(data: string): SocketData {
    const result = JSON.parse(data);
    if (result.hasOwnProperty("timestamp")) {
      result.timestamp = new Date(result.timestamp);
    }
    return result;
  }

  public on<T extends SocketData>(event: string, cb: (data: T) => void) {
    if (!this.listeners.hasOwnProperty(event)) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(cb);
  }

  public onError(cb: (e: Event) => void) {
    this.errorListeners.push(cb);
  }

  public send<T extends SocketData>(data: T) {
    const jsonData = JSON.stringify(data);
    this.ws.send(jsonData);
  }

  public close() {
    this.ws.close();
  }
}

export class GameSocketService extends SocketService {
  public onMove(cb: (data: SocketData<Move>) => void) {
    this.on("move", cb);
  }

  public onPromotion(cb: (data: SocketData<Promotion>) => void) {
    this.on("promotion", cb);
  }

  public sendMove(data: Move) {
    const socketData: SocketData<Move> = { type: "move", ...data };
    this.send(socketData);
  }

  public sendPromotion(data: Promotion) {
    const socketData: SocketData<Promotion> = { type: "promotion", ...data };
    this.send(socketData);
  }
}
