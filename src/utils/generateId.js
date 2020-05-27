const generateId = () => {
  // Does not need to be crypto secure
  const data = new Date().getTime().toString();
  return require('crypto').createHash('sha1').update(data).digest('hex');
};

module.exports = generateId;
