# wikipedia-sample

Wikipedia記事を使ったVivliostyle CSS組版サンプル

## サンプルの閲覧

Vivliostyle Viewer での閲覧はこちら：  
https://vivliostyle.org/viewer/#src=https://murakamishinyu.github.io/wikipedia-sample/

Vivliostyle Viewer を使わないで閲覧する場合はこちら：  
https://murakamishinyu.github.io/wikipedia-sample/

## サンプルとして使用したWikipedia記事

- [神話](https://ja.wikipedia.org/wiki/神話)
- [日本神話](https://ja.wikipedia.org/wiki/日本神話)
- [ギリシア神話](https://ja.wikipedia.org/wiki/ギリシア神話)

Wikipedia記事のテキストのライセンスについて：

> テキストは[クリエイティブ・コモンズ 表示-継承ライセンス](https://creativecommons.org/licenses/by-sa/4.0/deed.ja)のもとで利用できます。追加の条件が適用される場合があります。詳細については[利用規約](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use)を参照してください。

## ファイルの説明

- [神話.txt](神話.txt) など: Wikipedia記事のソース編集でのWikiテキストをそのまま保存したファイル
- [神話.md](神話.md) など: WikiテキストをMarkdown形式に変換したファイル。変換には [wikitext2vfm.js](wikitext2vfm.js) を使用。
- [神話.html](神話.html) など: MarkdownファイルをHTML形式に変換したファイル。`vivliostyle build` で生成。
- [cover.jpg](cover.jpg): カバー画像。Wikipediaの [プロジェクト:神話](https://ja.wikipedia.org/wiki/プロジェクト:神話) にある画像を使用。
- [cover.html](cover.html): カバーページ。`vivliostyle build` で生成。
- [index.html](index.html): 目次ページ。`vivliostyle build` で生成。
- [publication.json](publication.json): 出版物マニフェストファイル。`vivliostyle build` で生成。
- [wikitext2vfm.js](wikitext2vfm.js): WikiテキストをMarkdown形式に変換するスクリプト。使い方：
  ```
  node wikitext2vfm.js < 神話.txt > 神話.md
  ```
- [vivliostyle.config.js](vivliostyle.config.js): Vivliostyle CSS組版の設定ファイル。
- [themes/](themes/): Vivliostyleのテーマファイルのディレクトリ。`vivliostyle build` で生成。
- [style.css](style.css): テーマをカスタマイズするCSSファイル。

## ビルド方法

1. WikiテキストをMarkdownに変換する。
   ```
   for f in *.txt; do node wikitext2vfm.js < $f > ${f%.txt}.md; done
   ```
2. MarkdownをHTMLに変換し、CSS組版でPDFを生成する。
   ```
   vivliostyle build
   ```
   
   これでMarkdownファイルからHTMLへの変換や目次の生成が行われ、CSS組版の結果としてPDFファイル "神話／Wikipediaから.pdf" が生成される。
