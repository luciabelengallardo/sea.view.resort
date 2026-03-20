import ruta from "../src/routes/reservas.js";

function listRouter(router) {
  const routes = [];
  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(",").toUpperCase();
      routes.push({ path: layer.route.path, methods });
    }
  });
  return routes;
}

console.log(JSON.stringify(listRouter(ruta), null, 2));
