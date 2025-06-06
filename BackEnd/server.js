import http from "http";
import { app } from "./app.js";
import connectDB from "./db/db.js";

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT || 3000, () => {
  console.log(`server listen on port ${PORT}`);
});
connectDB()
