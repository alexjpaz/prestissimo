const fs = require('fs').promises;

exports.html5fallback = () => {
  return async (req, res, next) => {
    try {
      // TODO
      let RouterBasename = req.requestContext.stage;

      if(!RouterBasename.startsWith("/")) {
        RouterBasename = "/" + RouterBasename;
      }

      const file = await fs.readFile('public/index.html');

      const Prestissimo = {
        RouterBasename,
      };

      const html = file.toString()
        .replace(/{{ Prestissimo }}/, JSON.stringify(Prestissimo, null, 2));
      ;

      res.send(html);
    } catch(e) {
      console.log(e);
      next(e);
    }
  };
};
