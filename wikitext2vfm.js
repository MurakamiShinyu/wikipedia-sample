"use strict";
const { match } = require("assert");
const crypto = require("crypto");
const fs = require("fs");

function md5hex(str) {
  const md5 = crypto.createHash("md5");
  return md5.update(str).digest("hex");
}

let text = fs.readFileSync(process.stdin.fd, "utf-8");

// Wikiテキストで問題がある箇所を応急的に修正
text = text.replace(/\[\[ギリシャ神話\]\]/g, "[[ギリシア神話]]");
text = text.replace(/Image:Hector1-4225\.jpg/g, "Image:Pierre_François_Delorme,_Hector1-4225.jpg");
text = text.replace(/ファイル:Inasa Beach\.jpg/g, "ファイル:Bentenjima_on_Inasa_Beach.jpg");

// Title
const title = text.match(/'''(.+?)'''/m)?.[1];

// Italic and Bold
text = text.replace(/'''''(.+?)'''''/g, "___$1___");
text = text.replace(/'''(.+?)'''/g, "__$1__");
text = text.replace(/''(.+?)''/g, "_$1_");

// Lists
text = text.replace(/^\*\*\*\*\* ?/gm, "        - ");
text = text.replace(/^\*\*\*\* ?/gm, "      - ");
text = text.replace(/^\*\*\* ?/gm, "    - ");
text = text.replace(/^\*\* ?/gm, "  - ");
text = text.replace(/^\* ?/gm, "- ");
text = text.replace(/^\*# ?/gm, "  1. ");
text = text.replace(/^## ?/gm, "   1. ");
text = text.replace(/^#\* ?/gm, "   - ");
text = text.replace(/^# ?/gm, "1. ");

// Definition Lists
text = text.replace(
  /^; ?(.+?)[ \n]: ?(.+?)$/gm,
  "<dl>\n<dt>$1</dt>\n<dd>\n\n$2\n</dd>\n</dl>"
);
text = text.replace(/^: ?(.+?)$/gm, "<dl>\n<dd>\n\n$1\n</dd>\n</dl>");
text = text.replace(/^<\/dl>\n<dl>\n/gm, "");

text = text.replace(/\n( *)- : ?(.+?)$/gm, "  \n$1    $2");
text = text.replace(/^; ?(.+?)$/gm, "\n$1\n");

// Headings
text = text.replace(/^===== ?(.+?) ?=====$/gm, "##### $1");
text = text.replace(/^==== ?(.+?) ?====$/gm, "#### $1");
text = text.replace(/^=== ?(.+?) ?===$/gm, "### $1");
text = text.replace(/^== ?(.+?) ?==$/gm, "## $1");

// Normalize spaces etc.
text = text.replace(/ *([=|]) */g, "$1");
text = text.replace(/\|[-\w]+=(?=[|}])/g, "");
text = text.replace(/<!--.*?-->/g, "");
text = text.replace(/(\{\{)\n/g, "$1");

// {{Anchors}}
text = text.replace(/\{\{Anchors\|(.+?)\}\}/g, "");

// Images
text = text.replace(
  /^\[\[(?:File|Image|ファイル|画像):([^|]+?)\|(?:(?:thumb|サムネイル|left|right|\d+px)\|)*(.+?)\]\]$/gm,
  (match, p1, p2) => {
    const f = p1.replace(/ /g, "_");
    const h = md5hex(f);
    const d = `${h.charAt(0)}/${h.charAt(0)}${h.charAt(1)}`;
    const url = `https://upload.wikimedia.org/wikipedia/commons/${d}/${f}`;
    if (/[\[{<]/.test(p2)) {
      return `<figure><img src="${url}" alt=""><figcaption>${p2}</figcaption></figure>\n`;
    } else {
      return `![${p2}](${url})\n`;
    }
  }
);

// [[Category]]
text = text.replace(/^\[\[Category:.+?\]\]$/gm, "");

// Links
// text = text.replace(/\[\[([^|]+?)\|([^|]+?)\]\]/g, "[$2](https://wikipedia.org/wiki/$1)");
// text = text.replace(/\[\[([^|]+?)\]\]/g, "[$1](https://wikipedia.org/wiki/$1)");

// とりあえずこれらの記事だけリンクにする
text = text.replace(/- \[\[(神話|ギリシア神話|日本神話)\]\]/g, "- [$1]($1.html)");

text = text.replace(/\[\[([^\[\]|]+?)\|([^\[\]|]+?)\]\]/g, "$2");
text = text.replace(/\[\[([^\[\]|]+?)\]\]/g, "$1");

// 外部リンク
text = text.replace(/\[(https?:\/\/\S+) ([^\[\]]+)\]/gi, "[$2]($1)");
text = text.replace(/\{\{en icon\}\}/gi, "（英語）");
text = text.replace(/\{\{ja icon\}\}/gi, "（日本語）");

// Ruby
text = text.replace(/\{\{読み仮名\|([^|]+?)\|([^|]+?)\}\}/g, "{$1|$2}");

// {{仮リンク}} etc.
text = text.replace(
  /\{\{(?:仮リンク|ill2|日本語版にない記事リンク)\|([^{}|¦]+).*?\}\}/gi,
  "$1"
);
text = text.replace(
  /\{\{要追加記述範囲\|(?:(?:\w+)=[^{}|¦]+\|)*([^{}|¦]+).*?\}\}/gi,
  "$1"
);

// {{lang}}
text = text.replace(
  /\{\{Lang-en-short\|(.+?)\}\}/gi,
  '英: <span lang="en">$1</span>'
);
text = text.replace(/\{\{En\|(.+?)\}\}/gi, '<span lang="en">$1</span>');
text = text.replace(
  /\{\{lang-el\|(.+?)\}\}/gi,
  'ギリシア語: <span lang="el">$1</span>'
);
text = text.replace(
  /\{\{lang\|(.+?)\|(.+?)\}\}/gi,
  '<span lang="$1">$2</span>'
);

// {{要ページ番号}}
text = text.replace(/\{\{要ページ番号[^{}]*\}\}/gi, "<sup>要ページ番号</sup>");

// {{small}}
text = text.replace(/\{\{small\|([^{}|¦]+?)\}\}/gi, "<small>$1</small>");

// {{harvnb}}
text = text.replace(/\|ref=[^{}|¦]*/g, "");
text = text.replace(/\|loc=([^{}|¦]*)/g, ", $1");
text = text.replace(/\|(pp?)=([^{}|¦]*)/g, ", $1.&nbsp;$2");
text = text.replace(
  /\{\{harv(?:nb|txt)?\|([^{}|¦]+?)\|(\d+\w?)(.*?)\}\}/gi,
  "$1 $2$3"
);
text = text.replace(
  /\{\{harv(?:nb|txt)?\|([^{}|¦]+?)\|([^{}|¦]+?)\|(\d+\w?)(.*?)\}\}/gi,
  "$1 &amp; $2 $3$4"
);
text = text.replace(
  /\{\{harv(?:nb|txt)?\|([^{}|¦]+?)\|([^{}|¦]+?)\|([^{}|¦]+?)\|(\d+\w?)(.*?)\}\}/gi,
  "$1, $2 &amp; $3 $4$5"
);

// <ref name="" />
text = text.replace(/<ref\b[^>]*\/>/g, "");

// {{sfn}}
text = text.replace(
  /\{\{sfn\|([^{}|¦]+?)\|(\d+\w?)(.*?)\}\}/gi,
  '<span class="footnote">$1 $2$3</span>'
);
text = text.replace(
  /\{\{sfn\|([^{}|¦]+?)\|([^{}|¦]+?)\|(\d+\w?)(.*?)\}\}/gi,
  '<span class="footnote">$1 &amp; $2 $3$4</span>'
);
text = text.replace(
  /\{\{sfn\|([^{}|¦]+?)\|([^{}|¦]+?)\|([^{}|¦]+?)\|(\d+\w?)(.*?)\}\}/gi,
  '<span class="footnote">$1, $2 &amp; $3 $4$5</span>'
);

// {{efn}}
text = text.replace(
  /\{\{(?:efn2?|Refnest)\|((?:[^{}]|\{\{[^{}]+\}\})+)\}\}/gi,
  '<span class="footnote">$1</span>'
);

// {{Cite}}
text = text.replace(/\|和書/g, "");
text = text.replace(
  /\|(?:author\d?=[^{}|¦]*|(?:first|last)\d?=[^{}|¦]*(?:\|(?:first|last)\d?=[^{}|¦]*)?)\|author\d?-?link\d?=(?::[a-z]{2}:)?([^{}|¦]*)/g,
  "¦$1 著"
);
text = text.replace(/\|last\d?=([^{}|¦]*)\|first\d?=([^{}|¦]*)/g, "¦$1, $2 著");
text = text.replace(/\|(?:author|last)\d?=([^{}|¦]*)/g, "¦$1 著");

text = text.replace(/\|editor\d?-?link\d?=([^{}|¦]*)/g, "");
text = text.replace(/\|editor\d?=([^{}|¦]*)/g, "¦$1 編");
text = text.replace(
  /\|editor\d?-first\d?=([^{}|¦]*)\|editor\d?-last\d?=([^{}|¦]*)/g,
  "¦$2, $1 編"
);
text = text.replace(/\|translator=([^{}|¦]*)/g, "¦$1 訳");

text = text.replace(/\|+title=([^{}|¦]*)/g, "¦「$1」");
text = text.replace(/\|journal=([^{}|¦]*)/g, "¦『$1』");
text = text.replace(/\|chapter=([^{}|¦]*)/g, "¦「$1」");
text = text.replace(/\|series=([^{}|¦]*)/g, "¦〈$1〉");
text = text.replace(/\|edition=([^{}|¦]*)/g, "¦（$1）");

text = text.replace(/\|(?:publisher|date|others)=/g, "¦");
text = text.replace(/\|year=(\d+)/g, "¦$1年");
text = text.replace(/\|pages?=(\d+(?:-\d+)?)/g, "¦$1頁");
text = text.replace(/\|volume=(\d+)/g, "¦第$1巻");
text = text.replace(/\|volume=/g, "¦");
text = text.replace(/\|isbn=([-\w]*)/g, "¦ISBN $1");
text = text.replace(/\|ISSN=([-\w]*)/g, "¦ISSN $1");
text = text.replace(/\|asin=([-\w]*)/g, "¦ASIN $1");
text = text.replace(/\|id=([-\w]*)/g, "¦$1");
text = text.replace(/\|url=([^{}|¦]*)/g, "¦<$1>");

text = text.replace(/\|language=[^{}|¦]*/g, "");
text = text.replace(/\|accessdate=[^{}|¦]*/g, "");

text = text.replace(
  /\{\{CRID\|(\d+)\}\}/gi,
  'CRID <a href="https://cir.nii.ac.jp/crid/$1">$1</a>'
);

text = text.replace(
  /\{\{(?:Cite(?: (?:book|journal|web))?|Citation)[|¦](.*?)\}\}/gi,
  "$1"
);
text = text.replace(/\{\{Wikicite.*?\|reference=(.*?)\}\}/gi, "$1");

text = text.replace(/¦(?=[|¦「『〈（])/g, "");
text = text.replace(/¦/g, "、");

text = text.replace(/\{\{SfnRef?\|.*?\}\}/gi, "");
text = text.replace(/\{\{see(?: also)?\|.*?\}\}/gi, "");
text = text.replace(/\{\{Full citation needed.*?\}\}/gi, "");

text = text.replace(/^\{\{.+?\}\}$/gm, "");
text = text.replace(/^\{\{[^{}\n]*$/gm, "");
text = text.replace(/^\}\}*$/gm, "");


text = text.replace(/\{\{googlemap.*?\}\}/gi, "");
text = text.replace(/^Googleマップ$/gm, "");


// remove empty footnote sections
text = text.replace(/^### (?:注釈|出典)\n\s*(?=#)/gm, "");
text = text.replace(/^## 脚注\n\s*(?=## )/gm, "");

// Footnotes
text = text.replace(
  /<ref\b[^>]*>(.+?)<\/ref>/g,
  '<span class="footnote">$1</span>'
);

text = "# " + title + "\n\n" + text;

// Output
process.stdout.write(text);
