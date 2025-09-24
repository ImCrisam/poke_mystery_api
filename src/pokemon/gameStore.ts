import { Injectable } from "@nestjs/common";

@Injectable()
export class GameStore {
  private games = new Map<string, { data: any; expires: NodeJS.Timeout }>();

  set(gameId: string, data: any, ttlMs: number = 60000) {
    // Si ya existía, limpiar timeout anterior
    const existing = this.games.get(gameId);
    if (existing) clearTimeout(existing.expires);

    const timeout = setTimeout(() => {
      this.games.delete(gameId);
    }, ttlMs);

    this.games.set(gameId, { data, expires: timeout });
  }

  get(gameId: string) {
    return this.games.get(gameId)?.data;
  }

  delete(gameId: string) {
    const existing = this.games.get(gameId);
    if (existing) clearTimeout(existing.expires);
    this.games.delete(gameId);
  }

  dump() {
    return Array.from(this.games.entries()).map(([key, val]) => ({
      key,
      value: val.data,
    }));
  }
}
