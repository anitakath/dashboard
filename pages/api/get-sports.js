export default function handler(req, res) {
  const sports = ["Eiskunstlauf", "Poledance", "Yoga"];
  res.status(200).json({ sports });
}
