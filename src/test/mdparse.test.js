const mdparse = require("../mdparse");

test("md to json file", () => {
  const json = mdparse("src/test/tip1.md", null, true);
});

test("mdx to json file", () => {
  const json = mdparse("src/test/coffee-in-a-pandemic.mdx", null, true);
});
