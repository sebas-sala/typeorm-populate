function formatText(text) {
  return text
    .trim()
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
}

function isValidInput(input) {
  return /^[a-zA-Z]+$/.test(input);
}

export { formatText, isValidInput };
