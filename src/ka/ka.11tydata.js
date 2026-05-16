module.exports = {
  layout: "base.njk",
  lang: "ka",
  navHome: "მთავარი",
  navServices: "სერვისები",
  navMarkets: "ბაზრები",
  navAbout: "ჩვენს შესახებ",
  navContact: "კონტაქტი",
  bookBtn: "დაჯავშნა",
  eleventyComputed: {
    permalink: (data) => data.pageRelPath ? `${data.lang}/${data.pageRelPath}` : undefined,
  },
};
