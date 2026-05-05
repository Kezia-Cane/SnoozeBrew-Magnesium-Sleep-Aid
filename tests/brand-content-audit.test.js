const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const htmlFiles = fs
  .readdirSync(repoRoot)
  .filter((fileName) => fileName.endsWith(".html"));

const forbiddenPatterns = [
  /\bjiyu\b/i,
  /\bkorea\b/i,
  /\bkorean\b/i,
  /\btoner\b/i,
  /\bfeline\b/i,
  /\bbloom\b/i,
  /\bskincare\b/i,
  /\bskin care\b/i,
  /\bseoul\b/i,
  /\bbusan\b/i,
  /\bgwangju\b/i
];

const requiredAddressLines = [
  "Silmea LLC",
  "5830 E 2nd Street Suite 7000, Unit #78521",
  "Casper",
  "WY 82609",
  "USA"
];

const oldAddressPattern = /5830 E 2nd Street Suite 7000, Unit #78521 Casper|Casper, WY 82609 USA|WY 82609 USA/i;

htmlFiles.forEach((fileName) => {
  const contents = fs.readFileSync(path.join(repoRoot, fileName), "utf8");

  forbiddenPatterns.forEach((pattern) => {
    assert.strictEqual(
      pattern.test(contents),
      false,
      `${fileName} contains forbidden template content matching ${pattern}`
    );
  });

  assert.ok(contents.includes("SnoozeBrew") || contents.includes("Snooze Brew"), `${fileName} should reference Snooze Brew`);
  assert.strictEqual(oldAddressPattern.test(contents), false, `${fileName} contains a compressed or inconsistent address`);

  if (contents.includes("Silmea LLC")) {
    requiredAddressLines.forEach((line) => {
      assert.ok(contents.includes(line), `${fileName} is missing address line: ${line}`);
    });
  }
});

console.log("PASS HTML pages contain only Snooze Brew brand content and consistent Silmea LLC address lines");
