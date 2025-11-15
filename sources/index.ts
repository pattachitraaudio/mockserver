import { Hono } from "hono";
import { elevenLabs } from "./api/elevenLabs/index.ts";

const app = new Hono({
    getPath: (req): string => {
        const method = req.method;
        const url = new URL(req.url);
        const hostname = url.hostname;
        const pathname = url.pathname;

        console.log(
            `${method} | Hostname: ${hostname}, Pathname: ${pathname}`
        );

        return `/${hostname}${pathname}`;
    }
});

app.route("/", elevenLabs);
Deno.serve({ "port": 8080 }, app.fetch);
