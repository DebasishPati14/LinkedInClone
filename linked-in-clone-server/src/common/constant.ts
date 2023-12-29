import { ApiProperty } from '@nestjs/swagger';

export const CONSTANTS = {
  // Swagger Strings
  swaggerTitle: 'LinkedIn Clone Application',
  swaggerDescription: 'Linked In Application API description for future front-end integration',
  swaggerVersion: '1.0',
  swaggerTag: 'LinkedIn Clone Application',

  // Response Message
  feedErrorMessage: 'No feed found with given Id',
  userErrorMessage: 'No User found with given Id',
  invalidCredentialErrorMessage: 'No User found with given Id',
  defaultErrorMessage: 'Server Error!',
  badRequest: 'Bad request!',
  passwordsNotMatching: 'Password and Confirm Password should be same.',
  successMessage: 'Operation Successful!',
};

export class SuccessResponse {
  @ApiProperty()
  success: string;
}

export class ErrorResponse {
  @ApiProperty()
  error: string;
}

export const ROLES_KEY = 'roles';
