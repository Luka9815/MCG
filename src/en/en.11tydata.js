module.exports = {
  layout: "base.njk",
  lang: "en",
  navHome: "Home",
  navServices: "Services",
  navAbout: "About",
  navContact: "Contact",
  bookBtn: "Book now",
  eleventyComputed: {
    permalink: (data) => data.pageRelPath ? `${data.lang}/${data.pageRelPath}` : undefined,
  },
};
