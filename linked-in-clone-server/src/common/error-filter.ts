import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { CONSTANT_STRINGS } from './constant';
import { Request, Response } from 'express';
import fs = require('fs');

type PassedErrorResponse = {
  status: number;
  message: string;
};

type CustomErrorResponse = {
  statusCode: number;
  message: string;
  method: string;
  path: string;
  timeStamp: string;
};

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse();
    const request: Request = context.getRequest();

    let errorMessage = CONSTANT_STRINGS.defaultErrorMessage;
    let erroStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      erroStatus = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage = (errorResponse as PassedErrorResponse).message ?? exception.message;
    }

    const customizedError: CustomErrorResponse = this.getErrorResponse(request, errorMessage, erroStatus);
    const loggingString = this.getLogString(customizedError, request, exception);
    this.writeErrorLogIntoFile(loggingString);
    response.status(erroStatus).json(customizedError);
  }

  getErrorResponse = (request: Request, message: string, status: number): CustomErrorResponse => ({
    statusCode: status,
    message,
    method: request.method,
    path: request.url,
    timeStamp: new Date().toUTCString(),
  });

  getLogString(customizedError: CustomErrorResponse, request: Request, exception: unknown): string {
    return `ResponseCode:${customizedError.statusCode}, \t Method: ${customizedError.method}, \tPath:${
      customizedError.path
    }\n
    ${JSON.stringify(customizedError)}\n
    User: ${request.user ? JSON.stringify(request.user) : 'Not Signed In.!'}
    StackTrace:${exception instanceof HttpException ? exception.stack : customizedError.message}\n\n`;
  }

  writeErrorLogIntoFile = (logString: string): void => {
    fs.appendFile('errors.log', logString, 'utf8', (err) => {
      if (!err) {
        console.log('Error Appended');
      }
    });
  };
}
