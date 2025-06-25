

import styles from './Goals.module.css'
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from 'react-redux';



const Goals = () => {

  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [imagePath, setImagePath] = useState(null)

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const userId = useSelector((state) => state.auth.userId)


  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/getGoals");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Fehler beim Laden der Ziele");

        setGoals(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGoals();
  }, []);


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
      goal_id: uuidv4(),
      title,
      isCompleted: false,
      target_date: targetDate,
      image_path: null,
      description,
      user_id: userId,
    };



    console.log(newGoal)

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


  const handleDelete = async (goal_id, title) => {

    const confirm = window.confirm(`Are you sure you want to delete this goal? "${title}"`);
    if (!confirm) return;
  
    try {
      const res = await fetch("/api/deleteGoal", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal_id }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Löschen des Ziels.");
  
      // Entferne das gelöschte Ziel aus dem lokalen State
      setGoals(goals.filter(goal => goal.goal_id !== goal_id));
    } catch (err) {
      console.error(err);
      alert("Ziel konnte nicht gelöscht werden.");
    }
  };

  const scrollToFormHandler = () => {
    const formElement = document.getElementById("form_container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };
  

  return (
    <div className="pt-10  relative">

        <button 
          className="absolute bg-red-50 hover:bg-red-200 transition-colors duration-300 top-2 left-2 py-2 mx-2 px-4"
          onClick={scrollToFormHandler}>
            create a new goal
        </button>

        <div className={styles.gridContainer}>
          {goals.map((goal) => (
            <div key={goal.goal_id} className={styles.goalCard}>
            <div className="flex justify-between items-start">
              <h1>{goal.title}</h1>
              <button
                className={styles.delete_btn}
                onClick={() => handleDelete(goal.goal_id, goal.title)}
              >
                Delete
              </button>
              <button className={styles.check_btn}> Completed!  </button>
            </div>
          </div>
          
          ))}
        </div>

      
      <div id="form_container" className="p-4 bg-red-50  flex justify-center w-full px-4">
        <form
          onSubmit={submitHandler}
          className="flex w-6/12 flex-col gap-4  p-4 "
        >
          <input
            type="text"
            placeholder="name your goal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="p-2 border  rounded focus:outline-none focus:ring-0"
          />
          {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}

          <textarea
            placeholder="describe your goal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="p-2 border rounded focus:outline-none focus:ring-0"
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
            className="p-2 border rounded focus:outline-none focus:ring-0"
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
