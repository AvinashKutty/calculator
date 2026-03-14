const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Calculator API
app.post("/calculate", (req, res) => {
  const { num1, num2, operation } = req.body;

  let result;

  switch (operation) {
    case "add":
      result = num1 + num2;
      break;

    case "subtract":
      result = num1 - num2;
      break;

    case "multiply":
      result = num1 * num2;
      break;

    case "divide":
      result = num2 !== 0 ? num1 / num2 : "Cannot divide by zero";
      break;

    default:
      result = "Invalid operation";
  }

  res.json({
    result: result,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
