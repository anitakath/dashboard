// validation.js


export const validateTitle = (title) => {
  if (title.length >= 3 && title.length <= 50) {
    return true;
  } else {
    return false;
  }
};

export const validateText = (text) => {

  if (text.length >= 5 && text.length <= 1000) {
    return true;
  } else {
    return false;
  }
};

export const validateDuration = (duration) => {
  const num = parseFloat(duration);
  return !isNaN(num) && num > 0; // Wenn duration eine positive Zahl ist
};

export const formatText = (text) => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

export const validateName = (name) => {
  return name.trim() !== ""; // Überprüfen, ob der Name nicht leer ist
};