const expr = require("express");

const app = expr();

app.use(expr.static('./'));

app.listen(process.env.PORT || 3000, function () {
  console.log(`Example app listening on port ${process.env.PORT || 3000} !`);
});