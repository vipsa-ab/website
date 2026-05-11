import http from "http";

export default function globalSetup() {
  return new Promise<void>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      // CORS headers — the browser sends OPTIONS preflight before POST
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:4321");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      if (
        req.method === "POST" &&
        (req.url === "/contact" || req.url === "/booking")
      ) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("{}");
        return;
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(3000, "127.0.0.1", () => setTimeout(resolve, 100));
    server.on("error", reject);
  });
}
