import { IncomingMessage, ServerResponse } from "http";

export const getBody = async (req: IncomingMessage) => {
    const parts: string[] = [];

    req.on('data', chunk => {
        parts.push(chunk);
    });

    await new Promise(resolve => req.on('end', resolve));

    return JSON.parse(parts.join(''));
};

export const cors = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight request (OPTIONS)
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
    }
}