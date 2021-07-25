const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");
const prettier = require("prettier");

const meta = { type: "remove", exp: /^---\n(?<meta>.*)---$/gims };

const removeJSX = { type: "remove", exp: /(?=<).*(?<=[/>])/gim };

const h1 = { type: "h1", exp: /^# (?<text>.*$)/gim };
const h2 = { type: "h2", exp: /^## (?<text>.*$)/gim };
const h3 = { type: "h3", exp: /^### (?<text>.*$)/gim };
const h4 = { type: "h4", exp: /^#### (?<text>.*$)/gim };
const h5 = { type: "h5", exp: /^##### (?<text>.*$)/gim };
const h6 = { type: "h6", exp: /^###### (?<text>.*$)/gim };

const mdxH = {
  type: "h4",
  exp: /^<(.*)Header(.*)title={"(?<text>.*)"}(.*)$/gim,
};

const p = { type: "p", exp: /^(?!(#|\n|<|{|"|<|]))(?<text>.*$)/gim };
const pCombined = {
  type: "p",
  exp: /(?<=(^#{1,} .*\n\n))(.*?)(?=^#{1,} )/gims,
};

const mdIMG = { type: "img", exp: /^!\[(?<alt>.*)]\((?<text>.*)\)/gim };

const mdxIMG = {
  type: "img",
  exp: /(?=<).*(?<=src={")(?<text>\S*(?=")).*(?<=\/>)/gim,
};

const mdparse = (mdPath, newPath, writeToFile, combinePTags) => {
  try {
    const isMDX = path.extname(mdPath) === ".mdx";
    const isMD = path.extname(mdPath) === ".md";

    if (!isMD && !isMDX)
      throw Error(
        `Cannot parse file with extension of '${path.extname(
          mdPath
        )}'. Must be '.md' or '.mdx'`
      );

    const name = path.basename(mdPath, path.extname(mdPath));

    const file = fs.readFileSync(mdPath, "utf-8");

    const frontMatter = matter(file, { excerpt: true });

    let json = `{ "name" : "${name}", "data": [\n${frontMatter.content}\n] }`;

    let regExpressions = [meta, h1, h2, h3, h4, h5, h6, p];

    if (isMDX) {
      regExpressions.splice(1, 0, mdxIMG, mdxH, removeJSX);
    } else {
      regExpressions.splice(1, 0, mdIMG);
    }

    regExpressions.forEach((r) => {
      json = replaceContent(json, r.type, r.exp);
    });

    json = prettier.format(json, { parser: "json-stringify" });

    if (!frontMatter.isEmpty) {
      const obj = JSON.parse(json);

      obj.meta = frontMatter.data;

      json = JSON.stringify(obj, null, 2);
    }

    if (fs.write) {
      if (newPath) {
        throw Error("Not implemented yet...");
      } else {
        const fileName = path.basename(mdPath, path.extname(mdPath));
        const dir = path.dirname(mdPath);
        const newPath = path.join(dir, fileName);
        fs.writeFileSync(newPath + ".json", json);
      }
    }
    return json;
  } catch (e) {
    console.error(e);
  }
};

const replaceContent = (content, type, exp) => {
  switch (type) {
    case "remove":
      return content.replace(exp, "");
    default:
      return content.replace(
        exp,
        `{ "type": "${type}", "content" : "$<text>" },`
      );
  }
};

module.exports = mdparse;
