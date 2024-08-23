import { useState } from "react";

const useFormValidation = () => {
  const [errors, setErrors] = useState({
    title: "",
    text: "",
    duration: "",
  });

  const validateTitle = (title) => {
    if (title.length < 3 || title.length > 50) {
      setErrors((prev) => ({
        ...prev,
        title: "Titel muss zwischen 3 und 50 Zeichen lang sein.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, title: "" }));
    return true;
  };

  const validateText = (text) => {
    if (text.length < 5 || text.length > 1000) {
      setErrors((prev) => ({
        ...prev,
        text: "Text muss zwischen 5 und 1000 Zeichen lang sein.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, text: "" }));
    return true;
  };

  const validateDuration = (duration) => {
    const num = parseFloat(duration);
    if (isNaN(num) || num <= 0) {
      setErrors((prev) => ({
        ...prev,
        duration: "Dauer muss eine positive Zahl sein.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, duration: "" }));
    return true;
  };

  return { validateTitle, validateText, validateDuration, errors };
};

export default useFormValidation;
