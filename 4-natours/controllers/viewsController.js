exports.getOverview = (req, res, next) => {
  res.status(200).render('overview');
};

exports.getTour = (req, res, next) => {
  res.status(200).render('tour');
};
