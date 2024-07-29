export default async function handler(req, res) {
  const { user, pass } = req.body;

  if (
    username === process.env.LOGIN_USERNAME &&
    password === process.env.LOGIN_PASSWORD
  ) {
    // Erfolgreiche Authentifizierung
    res.status(200).json({ message: "Login erfolgreich" });
  } else {
    // Fehlgeschlagene Authentifizierung
    res.status(401).json({ message: "Ungültiger Benutzername oder Passwort" });
  }
}
