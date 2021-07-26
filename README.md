# md2json-cli

A command line tool for converting markdown and MDX files into an API consumable JSON format.

## Usage

This script uses regular expressions to find and replace markdown elements to be converted into a consistent JSON format.

A normal usage might look like this:

```
md2json example-markdown.md
```

A file will be outputted in the current directory with the same name and the following json format:

```
{
  "name": "example-markdown",
  "data": [
    {
      "type": "h1",
      "content": "This is the title of my markdown file"
    },
    {
      "type": "p",
      "content": "This is a paragraph in my markdown file"
    },
    {
      "type": "img",
      "content": "https://www.exampleimageurl.com"
    }
  ],
  "meta" : {
      "date": "2021-03-19T00:00:00.000Z",
      "title": "Example Markdown",
      "isPublished": true
  }
}
```

Note: There are still many markdown and JSX elements that have yet to be implemented.

## Acknowledgements
#### This project makes use of the following open source npm packages

- [Yargs](https://www.npmjs.com/package/yargs)
- [Gray Matter](https://www.npmjs.com/package/gray-matter)
- [Prettier](https://www.npmjs.com/package/prettier)