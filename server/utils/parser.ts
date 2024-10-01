export const stripMarkdown = (
  string: string,
  options: { flattenLineToSingleSpace: boolean } = {
    flattenLineToSingleSpace: false,
  },
) => {
  options = options || {};
  options.flattenLineToSingleSpace = options.flattenLineToSingleSpace || false;

  let output = string || "";

  // remove horizontal rules (lists conflict with this rule, so it must come first)
  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*/gm, "");

  // strip out lists
  output = output.replace(/^([\s\t]*)([*\-+]|\d+\.)\s+/gm, "$1");

  // github flavored markdown
  output = output
    // header
    .replace(/\n={2,}/g, "\n")
    // fenced code blocks
    .replace(/~{3}.*\n/g, "")
    // strikethrough
    .replace(/~~/g, "")
    // fenced code blocks
    .replace(/`{3}.*\n/g, "");

  // remove abbreviations
  output = output.replace(/\*\[.*\]:.*\n/, "");

  // remove HTML tags
  output = output
    .replace(/<[^>]*>/g, "")
    .replace(new RegExp("<[^>]*>", "g"), "");

  output = output
    // remove setext-style headers
    .replace(/^[=-]{2,}\s*$/g, "")
    // remove footnotes
    .replace(/\[\^.+?\](: .*?$)?/g, "")
    .replace(/\s{0,2}\[.*?\]: .*?$/g, "")
    // remove images
    .replace(/!\[(.*?)\][[(].*?[\])]/g, "$1")
    // remove inline links
    .replace(/\[([^\]]*?)\][[(].*?[\])]/g, "$1")
    // remove blockquotes
    .replace(/^(\n)?\s{0,3}>\s?/gm, "$1")
    // remove reference-style links
    .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "")
    // remove atx-style headers
    .replace(
      /^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm,
      "$1$3$4$6",
    )
    // remove * emphasis
    .replace(/([*]+)(\S)(.*?\S)??\1/g, "$2$3")
    // remove _ emphasis. Unlike *, _ emphasis gets rendered only if
    //   1. either there is a whitespace character before opening _ and after closing _.
    //   2. or _ is at the start/end of the string.
    .replace(/(^|\W)([_]+)(\S)(.*?\S)??\2($|\W)/g, "$1$3$4$5")
    // remove code blocks
    .replace(/(`{3,})(.*?)\1/gm, "$2")
    // remove inline code
    .replace(/`(.+?)`/g, "$1")
    // replace two or more newlines with exactly two
    .replace(/\n{2,}/g, "\n\n")
    // replace strike through
    .replace(/~(.*?)~/g, "$1");

  if (options.flattenLineToSingleSpace) {
    output = output
      // replace line breaks with spaces
      .replace(/\n/g, " ")
      // replace multiple spaces with one space
      .replace(/\s+/g, " ")
      // remove leading and trailing spaces
      .trim();
  }

  return output;
};
