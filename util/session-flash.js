function getSessionData(req) {
  const sessionData = req.session.falshData;

  req.session.falshData = null;
  return sessionData;
}
function flashDataToSession(req, data, action) {
  req.session.falshData = data;
  req.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
