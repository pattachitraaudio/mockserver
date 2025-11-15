import { Hono } from "hono";
import { user } from "./user/index.ts";

const host = "api.elevenlabs.io";
const elevenLabs = new Hono();

elevenLabs.route(`/${host}`, user);

export { elevenLabs };
