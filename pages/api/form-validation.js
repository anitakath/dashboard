// /pages/api/form-validation.js

import { v4 as uuidv4 } from "uuid";

const validateInputs = (inputs) => {
  const errors = {};

  if (!inputs.title || inputs.title.length < 3 || inputs.title.length > 50) {
    errors.title = "Title must be between 3 and 50 characters.";
  }

  if (!inputs.text || inputs.text.length < 5 || inputs.text.length > 1000) {
    errors.text = "Text must be between 5 and 1000 characters.";
  }

  if (
    !inputs.duration ||
    isNaN(inputs.duration) ||
    parseFloat(inputs.duration) <= 0
  ) {
    errors.duration = "Duration must be a positive number.";
  }

  if (!inputs.created_at) {
    errors.created_at = "Created at date is required.";
  }

  if (!inputs.name) {
    errors.name = "Name is required.";
  }

  return Object.keys(errors).length ? errors : null;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const inputs = req.body;

    // Validate the inputs
    const validationErrors = validateInputs(inputs);

    if (validationErrors) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    // If validation passes, you can forward the data to the appropriate endpoint
    try {
      const uniqueID = uuidv4();
      const data = { ...inputs, entryId: uniqueID };

      // Here you can send the data to either planned-sports or sports based on your logic
      let response;
      if (req.query.path === "/profile") {
        response = await fetch("/api/send-plannedSports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/plannedSports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) throw new Error("Fehler beim Senden der Daten");

      const result = await response.json();
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Fehler:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
