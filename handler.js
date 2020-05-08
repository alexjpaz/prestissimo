// FIXME - Hacky!
process.env.PATH = `${process.env.LAMBDA_TASK_ROOT || './'}/opt`;

const { convert } = require('./convert');

module.exports.convert = async (event, context) => {
  try {
    await convert(event, context);
  } catch(e) {
    console.error(e);
    throw e;
  }
};
