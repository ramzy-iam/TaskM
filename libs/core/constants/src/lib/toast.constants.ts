export const TOAST_HEADER_KEY = 'X-Toast-Options';

export enum TOAST_COMMON_MESSAGES {
  SOMETHING_WENT_WRONG = 'Something went wrong',
  FAILED_TO_LOAD_RESOURCE = 'Failed to load the resource',
  FAILED_TO_SAVE = 'Failed to save',
  FAILED_TO_DELETE = 'Failed to delete',
  FAILED_TO_UPDATE = 'Failed to update',
  FAILED_TO_CREATE = 'Failed to create',
  OPERATION_SUCCESSFUL = 'Operation successful',
  SUCCESS_MESSAGE = 'Success',
  UPDATED_SUCCESSFULLY = 'Updated successfully',
  DELETED_SUCCESSFULLY = 'Deleted successfully',
  CREATED_SUCCESSFULLY = 'Created successfully',

  REQUESTED_RESOURCE_WAS_NOT_FOUND = 'The requested resource was not found.',
  NOT_AUTHORIZED = 'You are not authorized to access this resource.',
  FORBIDDEN = 'Access to this resource is forbidden.',
  INTERNAL_SERVER_ERROR = 'An internal server error occurred.',
  AN_ERROR_OCCURRED = 'An unexpected error occurred.',
}
