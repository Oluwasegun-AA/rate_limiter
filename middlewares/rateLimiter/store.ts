import type { Store, Options, RateLimitDetailResponse } from './types.js';

/**
 * esimate reset time
 * @param {number} rateLimit  - The duration of a window (in milliseconds).
 * @returns {Date}
 */
const calculateNextResetTime = (rateLimit: number): Date => {
  const resetTime = new Date();
  resetTime.setMilliseconds(resetTime.getMilliseconds() + rateLimit);
  return resetTime;
};

//A `Store` that stores the hit count for each client in memory.
export default class RateLimitStore implements Store {
  //The duration of time before which all hit counts are reset(in milliseconds).
  limtWindow
  maxLimit

  //a dictionary with the number of apiCalls for clients.
  apiCalls!: {
    [key: string]: number | undefined;
  };

  //The time at which all counts will be reset.
  resetTime!: Date;

  //current client's timer.
  interval?: NodeJS.Timer;

  //initialize the store.
  init(options: Options): RateLimitStore {
    this.limtWindow = options.limtWindow;
    this.maxLimit = options.maxLimit;
    this.resetTime = calculateNextResetTime(this.limtWindow);
    this.apiCalls = {};
    this.interval = setInterval(async () => {
      await this.resetAll();
    }, this.limtWindow);
    if (this.interval.unref) this.interval.unref(); //detach timer from event loop (timer is still running)
    return this;
  }

  async increment(key: string): Promise<RateLimitDetailResponse> {
    const totalApiCalls = (this.apiCalls[key] ?? 0) + 1;
    this.apiCalls[key] = totalApiCalls;

    return {
      totalApiCalls,
      resetTime: this.resetTime,
    };
  }

  async decrement(key: string): Promise<void> {
    const current = this.apiCalls[key];
    if (current) this.apiCalls[key] = current - 1;
  }

  //Reset all counter.
  async resetAll(): Promise<void> {
    this.apiCalls = {};
    this.resetTime = calculateNextResetTime(this.limtWindow);
  }

  //Clean up
  shutdown(): void {
    clearInterval(this.interval);
  }
}
