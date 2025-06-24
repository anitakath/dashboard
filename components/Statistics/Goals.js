





import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Goals = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const allowedPattern = /^[a-zA-Z0-9\s\-?!\.]*$/;

  const validateInputs = () => {
    const newErrors = {};

    // Titelvalidierung
    if (title.length < 4 || title.length > 100) {
      newErrors.title = "Der Titel muss zwischen 4 und 100 Zeichen lang sein.";
    } else if (!allowedPattern.test(title)) {
      newErrors.title = "Nur Buchstaben, Zahlen, Leerzeichen, '-', '?', '!', '.' erlaubt.";
    }

    // Beschreibungvalidierung
    if (description.length > 0 && (description.length < 5 || description.length > 500)) {
      newErrors.description =
        "Die Beschreibung muss entweder leer oder zwischen 5 und 500 Zeichen lang sein.";
    } else if (description.length > 0 && !allowedPattern.test(description)) {
      newErrors.description = "Nur Buchstaben, Zahlen, Leerzeichen, '-', '?', '!', '.' erlaubt.";
    }

    // Datum prüfen
    if (!targetDate) {
      newErrors.targetDate = "Bitte wähle ein Datum.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateInputs()) return;

    setLoading(true);

    const newGoal = {
      id: uuidv4(),
      title,
      description,
      target_date: targetDate,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/submitGoal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGoal),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ein Fehler ist aufgetreten");
      }

      setMessage("Ziel erfolgreich gespeichert!");
      setTitle("");
      setDescription("");
      setTargetDate("");
      setErrors({});
    } catch (error) {
      console.error(error);
      setMessage("Fehler beim Speichern.");
    }

    setLoading(false);
  };

  return (
    <div className="pt-10 relative">

        <button className="absolute bg-red-50 hover:bg-red-200 transition-colors duration-300 top-2 left-2 py-2 mx-2 px-4">
            create a new goal
        </button>

      <div className="h-screen md:h-80 p-2 flex flex-col sm:flex-row items-center justify-center w-full">
        {/* Beispiel-Ziele */}
        <div className="bg-red-50 h-full flex justify-center items-center md:h-5/6 w-full sm:w-1/4 m-2">
          <h1 className="text-center">Master the Ayesha</h1>
        </div>
        <div className="bg-red-50 h-full flex justify-center items-center md:h-5/6 w-full sm:w-1/4 m-2">
          <h1 className="text-center">Master the Handspring</h1>
        </div>
        <div className="bg-red-50 h-full flex justify-center items-center md:h-5/6 w-full sm:w-1/4 m-2">
          <h1 className="text-center">Take part in a figure skating competition</h1>
        </div>
        <div className="bg-red-50 h-full flex justify-center items-center md:h-5/6 w-full sm:w-1/4 m-2">
          <h1 className="text-center">Jump the Axel</h1>
        </div>

      </div>

      
      <div id="form_container" className="p-4 max-w-xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 bg-red-50 p-4 shadow-md"
        >
          <input
            type="text"
            placeholder="name your goal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
          />
          {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}

          <textarea
            placeholder="describe your goal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
          />
          {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}

          <p className="text-xs mx-2 mt-2">
            by when you want to reach your goal? - date your goal
          </p>

          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-0"
          />
          {errors.targetDate && <p className="text-red-600 text-xs">{errors.targetDate}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-200 hover:bg-red-300 transition-colors duration-300 py-2 rounded"
          >
            {loading ? "submitting..." : "submit your goal"}
          </button>

          {message && <p className="text-sm text-center text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Goals;
