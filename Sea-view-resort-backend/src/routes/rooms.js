// This file re-exports the canonical rooms router to avoid duplicate
// route definitions. The authoritative implementation lives in
// `rooms.routes.js` which includes detailed handlers and image upload
// endpoints.

import roomsRouter from "./rooms.routes.js";

export default roomsRouter;
