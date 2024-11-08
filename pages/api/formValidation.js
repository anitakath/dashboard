// pages/api/formValidation.js

const validateTitle = (title) =>
  title && title.length >= 3 && title.length <= 50;

const validateText = (text) => text && text.length >= 5 && text.length <= 1000;

const validateDuration = (duration) => {
  const num = parseFloat(duration);
  return !isNaN(num) && num > 0;
};
const validateName = (name) => name && name.trim() !== "";


export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, entry: text, duration, name, created_at } = req.body;
    console.log(req.body);

    const errors = {};

    if (!validateTitle(title)) errors.title = "Invalid title";
    if (!validateText(text)) errors.text = "Invalid text";
    if (!validateDuration(duration)) errors.duration = "Invalid duration";
    if (!validateName(name)) errors.name = "Invalid name";

    if (!created_at || isNaN(Date.parse(created_at))) {
      errors.createdAt = "Creation date must be a valid date";
    }

    // XSS-Security
    if (/</.test(text) || />/.test(text)) {
      errors.text = "Input contains invalid characters.";
    }


    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // if everything is valid...
    res.status(200).json({ message: "Validation successful" });
  } catch (error) {
    console.error("Error in validation:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
