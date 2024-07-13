// Render inbox page
const index = (req, res, next) => {
  res.locals.html = true;
  res.render("index", {
    title: "Inbox Page",
  });
};

module.exports = {
  index,
};
