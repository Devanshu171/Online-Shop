const expressSession = require("express-session");
const MongoDbStore = require("connect-mongodb-session");

function createSessionStore() {
  const MonogDBStore = MongoDbStore(expressSession);

  const store = new MonogDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "online-shop",
    collection: "session",
  });
  return store;
}

function createSessionConfig() {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
