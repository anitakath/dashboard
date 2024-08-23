// validation.js

export const validateTitle = (title) => {
  return title.length >= 3 && title.length <= 50;
};

export const validateText = (text) => {
  return text.length >= 5 && text.length <= 1000;
};

export const validateDuration = (duration) => {
  const num = parseFloat(duration);
  return !isNaN(num) && num > 0; // Wenn duration eine positive Zahl ist
};

export const formatText = (text) => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

