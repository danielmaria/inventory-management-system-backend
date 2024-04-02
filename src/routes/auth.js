const jwt = require("jsonwebtoken");
require('dotenv').config()
const apiToken = process.env.API_TOKEN;

module.exports = function(...roles) {
  return async (request, response, next) => {
    try {
      const token = request.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, apiToken);
      const userRoles = decodedToken.roles;

      if (!roles.some(role => userRoles.includes(role))) {
        return response.status(403).json({ error: "You are not authorized to access this endpoint" });
      }

      request.user = decodedToken;
      next();
    } catch (error) {
      response.status(401).json({
        error: "Invalid token",
      });
    }
  };
};
