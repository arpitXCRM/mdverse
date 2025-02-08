exports.facebookCallback = (req, res) => {
  res.redirect(`${process.env.REDIRCT_URL}`);
};

exports.getUser = (req, res) => {
  res.send(req.user ? req.user : null);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect(process.env.REDIRCT_URL);
  });
};
