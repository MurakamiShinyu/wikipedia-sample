// @ts-check
/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
const vivliostyleConfig = {
  title: '神話／Wikipediaから', // populated into 'publication.json', default to 'title' of the first entry or 'name' in 'package.json'.
  author: 'Wikipedia', // default to 'author' in 'package.json' or undefined
  language: 'ja',
  // readingProgression: 'rtl', // reading progression direction, 'ltr' or 'rtl'.
  size: 'a4',
  theme: [
    '@vivliostyle/theme-techbook', // .css or local dir or npm package. default to undefined
    'style.css',
  ],
  image: 'ghcr.io/vivliostyle/cli:8.12.0',
  entry: [ // **required field**
    '神話.md',
    'ギリシア神話.md',
    '日本神話.md',
    // 'introduction.md', // 'title' is automatically guessed from the file (frontmatter > first heading)
    // {
    //   path: 'epigraph.md',
    //   title: 'おわりに', // title can be overwritten (entry > file),
    //   theme: '@vivliostyle/theme-whatever' // theme can be set individually. default to root 'theme'
    // },
    // 'glossary.html' // html is also acceptable
  ], // 'entry' can be 'string' or 'object' if there's only single markdown file
  // entryContext: './manuscripts', // default to '.' (relative to 'vivliostyle.config.js')
  // output: [ // path to generate draft file(s). default to '{title}.pdf'
  //   './output.pdf', // the output format will be inferred from the name.
  //   {
  //     path: './book',
  //     format: 'webpub',
  //   },
  // ],
  // workspaceDir: '.vivliostyle', // directory which is saved intermediate files.
  toc: {
    title: '目次',
    htmlPath: 'index.html',
    sectionDepth: 4,
  },
  cover: './cover.jpg', // cover image. default to undefined.
  // vfm: { // options of VFM processor
  //   replace: [ // specify replace handlers to modify HTML outputs
  //     {
  //       // This handler replaces {current_time} to a current local time tag.
  //       test: /{current_time}/,
  //       match: (_, h) => {
  //         const currentTime = new Date().toLocaleString();
  //         return h('time', { datetime: currentTime }, currentTime);
  //       },
  //     },
  //   ],
  //   hardLineBreaks: true, // converts line breaks of VFM to <br> tags. default to 'false'.
  //   disableFormatHtml: true, // disables HTML formatting. default to 'false'.
  // },
};

module.exports = vivliostyleConfig;
