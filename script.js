'use strict';

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay(value) {
  resultEl.textContent = value;
  // Adjust font size for long numbers
  resultEl.classList.remove('small', 'xsmall');
  if (String(value).length > 12) {
    resultEl.classList.add('xsmall');
  } else if (String(value).length > 9) {
    resultEl.classList.add('small');
  }
}

function setExpression(text) {
  expressionEl.textContent = text;
}

function handleNumber(value) {
  if (shouldResetScreen) {
    currentInput = value;
    shouldResetScreen = false;
  } else {
    currentInput = currentInput === '0' ? value : currentInput + value;
  }
  updateDisplay(currentInput);
}

function handleDecimal() {
  if (shouldResetScreen) {
    currentInput = '0.';
    shouldResetScreen = false;
    updateDisplay(currentInput);
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay(currentInput);
  }
}

function handleOperator(op) {
  if (operator && !shouldResetScreen) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  shouldResetScreen = true;
  const displayOp = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' }[op] || op;
  setExpression(previousInput + ' ' + displayOp);
}

function calculate() {
  if (!operator || !previousInput) return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      if (curr === 0) {
        setExpression('');
        currentInput = 'Error';
        operator = null;
        previousInput = '';
        shouldResetScreen = true;
        updateDisplay(currentInput);
        return;
      }
      result = prev / curr;
      break;
    case '%': result = prev % curr; break;
    default: return;
  }

  // Round floating-point imprecision
  result = parseFloat(result.toPrecision(12));

  const displayOp = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' }[operator] || operator;
  setExpression(previousInput + ' ' + displayOp + ' ' + currentInput + ' =');
  currentInput = String(result);
  operator = null;
  previousInput = '';
  shouldResetScreen = true;
  updateDisplay(currentInput);
}

function handleClear() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetScreen = false;
  setExpression('');
  updateDisplay('0');
}

function handleBackspace() {
  if (shouldResetScreen || currentInput === 'Error') return;
  if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay(currentInput);
}

function handleToggleSign() {
  if (currentInput === '0' || currentInput === 'Error') return;
  currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
  updateDisplay(currentInput);
}

// Button click handler
document.querySelector('.buttons').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'number':    handleNumber(value); break;
    case 'decimal':   handleDecimal(); break;
    case 'operator':  handleOperator(value); break;
    case 'equals':    calculate(); break;
    case 'clear':     handleClear(); break;
    case 'backspace': handleBackspace(); break;
    case 'toggle-sign': handleToggleSign(); break;
  }
});

// Keyboard support
document.addEventListener('keydown', function (e) {
  if (e.key >= '0' && e.key <= '9') {
    handleNumber(e.key);
  } else if (e.key === '.') {
    handleDecimal();
  } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
    handleOperator(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    calculate();
  } else if (e.key === 'Backspace') {
    handleBackspace();
  } else if (e.key === 'Escape') {
    handleClear();
  }
});
