module.exports = {
  layout: "base.njk",
  lang: "ru",
  navHome: "Главная",
  navServices: "Услуги",
  navAbout: "О нас",
  navContact: "Контакты",
  bookBtn: "Запись",
  eleventyComputed: {
    permalink: (data) => data.pageRelPath ? `${data.lang}/${data.pageRelPath}` : undefined,
  },
};
