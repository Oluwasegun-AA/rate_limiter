// counter interface
export type Store = {
  limtWindow: number;
  maxLimit: number;

  init: (options: Options) => void;

  //inncrement counter
  increment: (key: string) => Promise<RateLimitDetailResponse> | RateLimitDetailResponse;

  //decrement counter
  decrement: (key: string) => Promise<void> | void;

  //Method to reset all rate limit counter..
  resetAll?: () => Promise<void> | void;
};

export type RateLimitDetailResponse = {
  totalApiCalls: number;
  resetTime: Date | undefined;
};


/**
 * The Rate limiter params.
 */
export type Options = {
  readonly limtWindow: number;
  readonly maxLimit: number;
};
