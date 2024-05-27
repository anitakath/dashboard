

export default function handler(req, res) {
  const sports = [
    {
      name: "Figure Skating",
      entries: [
        { date: "2022-10-01", entry: "Had a great practice session today." },
        { date: "2022-10-02", entry: "Worked on my jumps and spins." },
      ],
    },
    {
      name: "Poledance",
      entries: [
        { date: "2022-10-01", entry: "Learned a new routine." },
        { date: "2022-10-03", entry: "Practiced strength exercises." },
      ],
    },
    {
      name: "Yoga",
      entries: [
        { date: "2022-10-02", entry: "Relaxed with a yoga session." },
        { date: "2022-10-04", entry: "Focused on breathing exercises." },
      ],
    },
  ];

  res.status(200).json({ sports });
}


/*
export default function handler(req, res) {
  const sports = [
    { name: "Figure Skating", entries: [] },
    { name: "Poledance", entries: [] },
    { name: "Yoga", entries: [] }
  ];
  res.status(200).json({ sports });
}
*/