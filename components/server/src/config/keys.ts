let KEYS = require("./dev");
if (process.env.NODE_ENV === "production") {
  KEYS = require("./prod");
} else if (process.env.NODE_ENV === "test") {
  KEYS = require("./testing");
}

export default KEYS;
