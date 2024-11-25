// hooks/useFormValidation.js
import { useState } from "react";

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateTitle = (title) => {
    if (title.length >= 3 && title.length <= 50) {
      return true;
    }
    setErrors((prev) => ({
      ...prev,
      title: "The title must be between 3 and 50 characters long.",
    }));
    return false;
  };

  const validateText = (text) => {
    if (text.length >= 5 && text.length <= 1000) {
      return true;
    }
    setErrors((prev) => ({
      ...prev,
      text: "The text must be between 5 and 1000 characters long.",
    }));
    return false;
  };

  const validateDuration = (duration) => {
    const num = parseFloat(duration);
    if (!isNaN(num) && num > 0) {
      return true;
    }
    setErrors((prev) => ({
      ...prev,
      duration: "The duration must be a positive number.",
    }));
    return false;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return { validateTitle, validateText, validateDuration, errors, clearErrors };
};
