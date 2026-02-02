#!/usr/bin/env node
import fs from "fs";
import { setTimeout as delay } from "timers/promises";

const BASE = process.env.BASE_URL || "http://localhost:4002";
const endpoints = ["/api/rooms", "/api/auth/verify-token", "/api/auth/profile"];

async function fetchWithTimeout(url, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      headers: Object.fromEntries(res.headers),
      body: text,
    };
  } catch (err) {
    return { error: err.message };
  } finally {
    clearTimeout(id);
  }
}

(async () => {
  for (const ep of endpoints) {
    const url = `${BASE}${ep}`;
    console.log("Requesting", url);
    const r = await fetchWithTimeout(url, 10000);
    const outFile = `/tmp/check_${ep.replace(/\W+/g, "_")}.json`;
    fs.writeFileSync(outFile, JSON.stringify({ url, result: r }, null, 2));
    console.log("Saved to", outFile);
    if (r.error) {
      console.log("  ERROR:", r.error);
    } else {
      console.log(`  status=${r.status} ok=${r.ok}`);
      const bodyPreview = r.body ? r.body.slice(0, 1000) : "";
      console.log("  bodyPreview:", bodyPreview.replace(/\n/g, " "));
    }
    console.log("---");
    await delay(200);
  }
  console.log("Done");
})();
