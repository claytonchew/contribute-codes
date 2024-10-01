import { describe, it, expect } from "vitest";
import { stripMarkdown } from "./parser";

describe("stripMarkdown", () => {
  it("should remove markdown formatting from the input string", () => {
    const input = MARKDOWN_SAMPLE;
    const expectedOutput = `
Heading 1

Heading 2

Heading 3

Hashtag in #heading

Hello world foo bar link - the quick brown fox jumps over the lazy dog.

image

Blockquote
Blockquote Line 2

HTML

non-matching*  tags

List item
List item
List item

List item
List item
List item

List item
List item
List item

{
  "key": "value",
  "key2": {
    "nested": "value"
  }
}

footnote
`;

    const output = stripMarkdown(input);

    expect(output).toBe(expectedOutput);
  });

  it("should flatten all lines to single space", () => {
    const input = MARKDOWN_SAMPLE;
    const expectedOutput =
      'Heading 1 Heading 2 Heading 3 Hashtag in #heading Hello world foo bar link - the quick brown fox jumps over the lazy dog. image Blockquote Blockquote Line 2 HTML non-matching* tags List item List item List item List item List item List item List item List item List item { "key": "value", "key2": { "nested": "value" } } footnote';

    const output = stripMarkdown(input, { flattenLineToSingleSpace: true });

    expect(output).toBe(expectedOutput);
  });

  it("should handle empty string input", () => {
    const input = "";
    const expectedOutput = "";

    const output = stripMarkdown(input);

    expect(output).toBe(expectedOutput);
  });
});

const MARKDOWN_SAMPLE = `
# Heading 1

## Heading 2

### Heading 3

# Hashtag in #heading

**Hello** _world_ ~~foo~~ \`bar\` [link](https://example.com) - *the* ***quick brown*** fox **jumps over** the ~~lazy dog~~.

![image](image.jpg)

> Blockquote
> Blockquote Line 2

<random props="value">HTML</random>

<single-line-html props="value" />

non-matching* <html> tags

- List item
- List item
- List item

1. List item
2. List item
3. List item

* List item
* List item
* List item

\`\`\`json
{
  "key": "value",
  "key2": {
    "nested": "value"
  }
}
\`\`\`

footnote[^1]
`;
