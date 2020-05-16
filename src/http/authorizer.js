const Authorizer = () => {
  return async (event, context, callback) => {
    throw new Error("Unathorized");
  };
};

module.exports = Authorizer;
