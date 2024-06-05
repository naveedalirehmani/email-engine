import { Request, Response, NextFunction } from "express";
import redis from "../services/redisClient";
import { ResponseMessages, ResponseStatus } from "../types/enums/responseEnums";

const WINDOW_SIZE_IN_SECONDS = parseInt(
  process.env.WINDOW_SIZE_IN_SECONDS || "60",
  10,
);
const MAX_WINDOW_REQUEST_COUNT = parseInt(
  process.env.MAX_WINDOW_REQUEST_COUNT || "10",
  10,
);

export const rateLimiter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const ip =
      request.ip ||
      request.headers["x-forwarded-for"]?.toString() ||
      request.connection.remoteAddress;

    if (!ip) {
      return response
        .status(ResponseStatus.BadRequest)
        .json({ message: "Unable to determine IP address" });
    }

    const currentRequestCount = await redis.incr(ip);

    if (currentRequestCount === 1) {
      await redis.expire(ip, WINDOW_SIZE_IN_SECONDS);
    }

    if (currentRequestCount > MAX_WINDOW_REQUEST_COUNT) {
      return response
        .status(ResponseStatus.RateLimit)
        .json({ message: ResponseMessages.RateLimit });
    }

    next();
  } catch (error) {
    console.error("Error in rateLimiter middleware:", error);
    return response
      .status(ResponseStatus.InternalServerError)
      .json({ message: ResponseMessages.InternalServerError });
  }
};
