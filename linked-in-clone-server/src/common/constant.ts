import { ApiProperty } from '@nestjs/swagger';

export const CONSTANT_STRINGS = {
  // Swagger Strings
  swaggerTitle: 'LinkedIn Clone Application',
  swaggerDescription: 'Linked In Application API description for future front-end integration',
  swaggerVersion: '1.0',
  swaggerTag: 'LinkedIn Clone Application',

  // Response Message
  feedErrorMessage: 'No feed found with given Id',
  userErrorMessage: 'No User found with given Id',
  invalidCredentialErrorMessage: 'Invalid Credentials were given .',
  recordExists: 'Existing Record found  with this data.',
  noRecordExists: 'No Record found  with this data.',
  defaultErrorMessage: 'Server Error!',
  badRequest: 'Bad request!',
  notAllowedToOperate: 'Not allowed for operation.',
  unacceptableFileType: 'FileType is not accepted please select ./jpeg/png/jpg type file',
  passwordsNotMatching: 'Password and Confirm Password should be same.',
  successMessage: 'Operation Successful!',
  sameUserFriendRequestError: 'Can not sent to yourself!',
  sendFriendRequestError: 'Request is already there between both of you!',
};

export const CONSTANTS = {
  validFileMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  validFileExtensions: ['jpeg', 'jpg', 'png'],
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
