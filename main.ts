// One Line of Earned Pride — make.fun entry.
//
// The task: one line of text, 1–240 characters, written to
// /output/entry.txt — a quiet, earned moment of pride for someone
// in a scene, a small person doing something hard or a long effort
// finally landing. The judge reads entries two at a time and picks
// the line that feels the most genuinely, quietly proud.
//
// The line (180 characters, inside the 1–240 gate):
//
//   All summer she'd swallowed half the pool, but on the last day
//   of August, eight-year-old June swam the full length without
//   stopping and touched the wall like she'd always known how.
//
// Why this line: the pride is earned inside it and never announced.
// A whole summer of swallowing pool water is the difficulty the
// reader can feel; one unbroken length on the last day of August is
// the long effort landing; and the pride arrives with the last
// words — a touch at the wall that reads like she had always known
// how. It is a concrete scene with a real person in it (eight-year-
// old June, a pool, the last day of August), it lands in one read,
// and it stays far from the stock trophy, podium and graduation
// images: just a kid, a pool, and a summer of trying.
//
// The program writes that single line to /output/entry.txt (the
// directory comes from MAKEFUN_OUTPUT_DIR, default /output) and
// prints exactly the same line to stdout. No network, no randomness,
// no environment secrets — every run produces the same bytes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const line =
  "All summer she'd swallowed half the pool, but on the last day of August, eight-year-old June swam the full length without stopping and touched the wall like she'd always known how.";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate allows 1–240 characters of UTF-8 text, not only
// whitespace, on a single line — so the code enforces the shape
// too: one line, inside the limit, no leading or trailing space.
if (line.length < 1 || line.length > 240) {
  throw new Error(`entry line is ${line.length} characters, outside the 1-240 limit`);
}
if (line.trim().length === 0 || /[\r\n]/.test(line)) {
  throw new Error("entry line must be one non-blank line");
}
if (line !== line.trim()) {
  throw new Error("entry line must not start or end with whitespace");
}
// A quiet line stays tight: no doubled spaces smuggled in by an
// edit, which would read as a stumble in the middle of the scene.
if (/  /.test(line)) {
  throw new Error("entry line must not contain doubled spaces");
}

const dst = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, line, "utf8");

// Read it back and verify the file holds exactly the line, byte
// for byte, so a partial or corrupted write can never reach the
// judge — and that its byte length matches the line's own byte
// length (this line is pure ASCII, so bytes equal characters at
// 180, but the check guards against a future edit silently adding
// a multi-byte character).
const written = readFileSync(dst, "utf8");
if (written !== line) {
  throw new Error("entry.txt does not hold exactly the entry line");
}
if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(line, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry line");
}

console.log(line);
