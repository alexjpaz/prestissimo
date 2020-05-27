class Exception extends Error {
  constructor(message, cause) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.cause = cause;

    if(this.cause) {
      this.stack += '\n   Caused by: ' + this.cause.stack;
    }
  }
}

module.exports = Exception;
