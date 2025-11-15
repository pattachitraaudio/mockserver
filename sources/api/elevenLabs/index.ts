import { Hono } from "hono";
import { user } from "./user/index.ts";

// const host = "api.elevenlabs.io";
const hostname = Deno.env.get("ELEVEN_LABS_API_HOSTNAME");

if (hostname == null) {
    console.error("env variable `ELEVEN_LABS_API_HOSTNAME cannot be null`");
    Deno.exit(-2);
}

const elevenLabs = new Hono();

elevenLabs.route(`/${hostname}`, user);

export { elevenLabs };
