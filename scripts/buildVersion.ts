import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { build, parse } from "plist";

const cwd = process.cwd();
const plistPath = join(cwd, "ios/allot/Info.plist");
const plist = parse(await readFile(plistPath, "utf-8")) as Record<string, any>;
const curBuildVersion = Number(plist.CFBundleVersion);
plist.CFBundleVersion = curBuildVersion + 1;

await writeFile(plistPath, build(plist));
console.log(
  `bumped build version from ${curBuildVersion} to ${plist.CFBundleVersion}`
);
