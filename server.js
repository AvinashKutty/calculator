const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

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
    case "power":
      result = Math.pow(num1, num2);
      break;
    case "modulus":
      result = num2 !== 0 ? num1 % num2 : "Cannot divide by zero";
      break;
    case "sqrt":
      result = num1 >= 0 ? Math.sqrt(num1) : "Invalid input";
      break;
    case "factorial":
      result = factorial(num1);
      break;
    case "percentage":
      result = (num1 / 100) * num2;
      break;
    default:
      result = "Invalid operation";
  }

  res.json({ result });
});

// Factorial function
function factorial(n) {
  if (n < 0) return "Invalid input";
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
