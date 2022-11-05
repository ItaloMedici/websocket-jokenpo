import http from "http"

const httpServer = http.createServer();
httpServer.listen(2121, () => console.log("Listening server.. on 2121"))

export default httpServer