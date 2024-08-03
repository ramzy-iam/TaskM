import { TOAST_COMMON_MESSAGES } from './toast.constants';

export enum HttpStatus {
  NotFound = 404,
  Unauthorized = 401,
  Forbidden = 403,
  InternalServerError = 500,
  default = 'default',
}

export const ErrorMessages: {
  [key in HttpStatus]: { summary: string; detail: string };
} = {
  [HttpStatus.NotFound]: {
    summary: 'Not Found',
    detail: TOAST_COMMON_MESSAGES.REQUESTED_RESOURCE_WAS_NOT_FOUND,
  },
  [HttpStatus.Unauthorized]: {
    summary: 'Unauthorized',
    detail: TOAST_COMMON_MESSAGES.NOT_AUTHORIZED,
  },
  [HttpStatus.Forbidden]: {
    summary: 'Forbidden',
    detail: TOAST_COMMON_MESSAGES.FORBIDDEN,
  },
  [HttpStatus.InternalServerError]: {
    summary: 'Internal Server Error',
    detail: TOAST_COMMON_MESSAGES.INTERNAL_SERVER_ERROR,
  },
  [HttpStatus.default]: {
    summary: 'Error',
    detail: TOAST_COMMON_MESSAGES.AN_ERROR_OCCURRED,
  },
};
