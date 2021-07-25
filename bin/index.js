#!/usr/bin/env node

const yargs = require("yargs");

const mdparse = require("../src/mdparse.js");

const mdPath = process.argv[2];

if (!mdPath) {
  console.error("Error: missing file path.");
  return;
}

const options = yargs
  .usage("Usage: -o <file_path>")
  .options("o", {
    alias: "file_path",
    describe: "The new file path to output the json to",
    type: "string",
    demandOption: false,
  })
  .usage("Usage: -c <combine_p_tags>")
  .options("c", {
    alias: "combine_p_tags",
    describe: "Combines p tags with newline character",
    type: "boolean",
    demandOption: false,
  }).argv;

mdparse(mdPath, options.o, true, options.c);
