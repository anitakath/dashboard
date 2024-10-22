// pages/api/validateRegistration.js
export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, confirmPassword } = req.body;

    // Validation logic
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }
    if (name.length < 1 || name.length > 20) {
      return res
        .status(400)
        .json({ error: "The name must be between 1 and 20 characters long." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "The passwords do not match." });
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(password)) {
      return res.status(400).json({
        error:
          "The password must be at least 6 characters long and contain at least one uppercase letter and one number.",
      });
    }

    // If everything is fine
    return res.status(200).json({ message: "Validation successful" });
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
