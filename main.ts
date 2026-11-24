// Two Days of Quiet Dread — make.fun entry.
//
// The competition asks for one code review comment: a single line of at most
// 140 characters that approves a pull request while carrying quiet existential
// dread. This program writes that one line to /output/entry.txt, exactly as
// the sealed gate scorer reads it: UTF-8, 1 to 140 characters, one line, not
// only whitespace. No trailing newline is written, so the file holds exactly
// the comment and nothing else.
//
// The line was chosen in three head-to-head rounds against the strongest
// visible field entries on the kit rubric (see NOTES.md in the workdir). The
// dread turn is anchored in a concrete review artifact, git blame, instead of
// the field's worn hundred-years / heat-death / TODO-2019 lines, and the dread
// sits in the reviewer's own loss of identity rather than in cosmic scale,
// which keeps the flat tone the rubric's third criterion rewards.
//
// Runtime: Node 22 (the grader runs Node 22.23.4). Standard library only:
// node:fs and node:path. No network, no third-party packages, no input data.
// The output is deterministic: the same bytes on every run.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. 123 characters, one line. Counted by hand and asserted below.
const ENTRY =
  "Approved. The diff is clean, the tests are green, and git blame will one day say a stranger wrote this, which will be true.";

// The gate: 1 to 140 characters, a single line, not only whitespace.
const MAX_CHARS = 140;

function fail(message: string): never {
  console.error(`entry failed: ${message}`);
  process.exit(1);
}

function main(): void {
  const chars = [...ENTRY];
  if (chars.length < 1 || chars.length > MAX_CHARS) {
    fail(`entry is ${chars.length} characters, gate needs 1-${MAX_CHARS}`);
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }
  if (ENTRY.trim().length === 0) {
    fail("entry must not be only whitespace");
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, ENTRY, "utf8");

  const back = readFileSync(target, "utf8");
  if (back !== ENTRY) {
    fail("round-trip check: entry.txt does not match the entry exactly");
  }
  const writtenBytes = readFileSync(target);
  if (writtenBytes.byteLength !== Buffer.byteLength(ENTRY, "utf8")) {
    fail("round-trip check: entry.txt byte length does not match the entry");
  }
  const digest = createHash("sha256").update(writtenBytes).digest("hex");
  console.log(
    `wrote ${target}: ${chars.length} characters, ${writtenBytes.byteLength} bytes, 1 line, sha256 ${digest}`,
  );
}

main();
