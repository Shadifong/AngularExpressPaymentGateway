const paypal = require("paypal-rest-sdk");
const init = () => {
  paypal.configure({
    mode: "sandbox",
    client_id:
      "AYjRlnRRtj8Idi7w4X10ij7RDOGoCarBi6NlTc3h6jAGACgEsddhvJbVUkdx6-m-Bnwqi20JOx0N9Uv7",
    client_secret:
      "EGoi3Lqh0st9W128pdJWft98LSc3Zvr1wxxF2ezwTGGTesZGl1XCJj_dK7s6gAdKZQTOyJnPN8iwSYn7"
  });
};

module.exports = {
  init
};
