const resultDisplay   = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const numberButtons  = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const clearBtn       = document.getElementById('clearBtn');
const equalsBtn      = document.getElementById('equalsBtn');

let firstNumber  = '';
let operator     = '';
let secondNumber = '';
let justCalculated = false;

function updateDisplay(value) {
  resultDisplay.textContent = value;
}

function handleNumber(value) {
  if (justCalculated) {

    firstNumber = '';
    operator    = '';
    secondNumber = '';
    expressionDisplay.textContent = '';
    justCalculated = false;
  }

  if (value === '.') {
    if (!operator && firstNumber.includes('.'))  return;
    if (operator  && secondNumber.includes('.')) return;
  }

  if (!operator) {
    firstNumber += value;
    updateDisplay(firstNumber);
  } else {
    secondNumber += value;
    updateDisplay(secondNumber);
  }
}

function handleOperator(value) {
  if (firstNumber !== '' && secondNumber !== '') {
    calculate();
    justCalculated = false;
  }

  if (firstNumber === '') return;
  operator = value;
  const niceOperator = { '*': '×', '/': '÷', '+': '+', '-': '−', '%': '%' }[value];
  expressionDisplay.textContent = firstNumber + ' ' + niceOperator;
}

function calculate() {
  if (firstNumber === '' || secondNumber === '' || operator === '') return;
  const num1 = parseFloat(firstNumber);
  const num2 = parseFloat(secondNumber);
  let answer;

  if (operator === '+') answer = num1 + num2;
  else if (operator === '-') answer = num1 - num2;
  else if (operator === '*') answer = num1 * num2;
  else if (operator === '%') answer = num1 % num2;
  else if (operator === '/') {

    if (num2 === 0) {
      updateDisplay("Can't ÷ 0");
      expressionDisplay.textContent = '';
      firstNumber = '';
      operator    = '';
      secondNumber = '';
      return;
    }
    answer = num1 / num2;
  }
  
  answer = parseFloat(answer.toFixed(10));
  const niceOp = { '*': '×', '/': '÷', '+': '+', '-': '−', '%': '%' }[operator];
  expressionDisplay.textContent = firstNumber + ' ' + niceOp + ' ' + secondNumber + ' =';
  updateDisplay(answer);
  firstNumber    = String(answer);
  secondNumber   = '';
  operator       = '';
  justCalculated = true;
}
function clearAll() {
  firstNumber    = '';
  operator       = '';
  secondNumber   = '';
  justCalculated = false;
  updateDisplay('0');
  expressionDisplay.textContent = '';
}
numberButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    handleNumber(button.dataset.value);
  });
});
operatorButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    handleOperator(button.dataset.value);
  });
});
clearBtn.addEventListener('click', clearAll);
equalsBtn.addEventListener('click', calculate);
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (!isNaN(key) || key === '.') handleNumber(key);
  else if (key === '+') handleOperator('+');
  else if (key === '-') handleOperator('-');
  else if (key === '*') handleOperator('*');
  else if (key === '/') { event.preventDefault(); handleOperator('/'); }
  else if (key === '%') handleOperator('%');
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Escape' || key === 'c') clearAll();
});
