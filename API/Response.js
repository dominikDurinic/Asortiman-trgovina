exports.successResp = (statusCode, status, message, response) => {
    return {
      code: statusCode,
      status,
      message,
      error: false,
      response
    };
};

exports.errorResp = (statusCode, status, message) => {
  return {
    code: statusCode,
    status,
    message,
    error: true,
    response: null
  };
};