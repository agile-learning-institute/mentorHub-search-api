import { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) =>
{
    let errorMessage = "An unknown error occured";
    let statusCode = 500;

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
};