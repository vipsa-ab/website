import http from "http";

// Minimal mock backend server for E2E tests
// Handles POST /contact and POST /booking, returns 200 OK with {} body

const server = http.createServer((req, res) => {
  if (
    req.method === "POST" &&
    (req.url === "/contact" || req.url === "/booking")
  ) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end("{}");
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end('{"error":"not found"}');
});

const PORT = 3000;

export async function startMockServer(): Promise<void> {
  return new Promise((resolve) => {
    server.listen(PORT, "localhost", () => {
      resolve();
    });
  });
}

export async function stopMockServer(): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}
