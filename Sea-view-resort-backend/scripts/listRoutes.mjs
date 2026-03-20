import app from "../app.js";

function listRoutes() {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      const methods = Object.keys(middleware.route.methods)
        .join(",")
        .toUpperCase();
      routes.push({ path: middleware.route.path, methods });
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .join(",")
            .toUpperCase();
          routes.push({ path: handler.route.path, methods });
        }
      });
    }
  });
  return routes;
}

console.log(JSON.stringify(listRoutes(), null, 2));
