import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./Login.module.css"; // Erstelle eine CSS-Datei für das Styling
import { supabase } from "@/services/supabaseClient"; // Importiere Supabase
import { useCallback } from "react";

//CUSTOM HOOKS
import useAuth from "@/custom-hooks/auth/useAuth";


const Register = ({ setRegister, setSuccessMessage, successMessage }) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const validateInputs = () => {
    const { name, email, password, confirmPassword } = registerData;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid e-mail address.";
    if (name.length < 1 || name.length > 20)
      return "The name must be between 1 and 20 characters long.";
    if (password !== confirmPassword) return "The passwords do not match.";
    if (!/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(password))
      return "The password must be at least 6 characters long and contain at least one capital letter and one number.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };


  
  const registerHandler = useCallback(async (e) => {
    e.preventDefault();

    // Rufe die API zur Validierung auf
    const response = await fetch("/api/validateRegistration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();


    if (!response.ok) {
      setError(data.error);
      return;
    }


    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check whether the e-mail already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", registerData.email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setError("Error when checking the e-mail.");
      return;
    }

    if (existingUser) {
      setError("This e-mail address is already registered.");
      return;
    }

    // Register user
    const { user, error: signUpError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: { data: { name: registerData.name } },
    });

    if (signUpError) {
      console.log(signUpError.message)
      setError(signUpError.message);
      return;
    }

    // Überprüfen, ob das Benutzerobjekt existiert
    if (!user) {
      setError(
        "User successfully registered. Please check your emails and activate your account."
      );
      return;
    } else {
      setError("Registration failed");
    }

    // Zusätzliche Benutzerdaten speichern
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        { id: user.id, email: registerData.email, name: registerData.name },
      ]);

    if (insertError) {
      console.log(insertError.message);
      setError(insertError.message);
      return;
    }

    // Successful registration
    setSuccessMessage(
      "Registration successful! Please check your e-mail for confirmation."
    );

    // Redirect after successful registration
    router.push("/login");
  },
    [registerData]
  );

  console.log(error)
 
  return (
    <div className="w-full h-full p-4">
      <div className=" flex flex-col items-center justify-center w-full h-full py-2 m-0 p-0 relative border-8">
        <form
          className="w-1/2 flex flex-col items-center justify-center"
          onSubmit={registerHandler}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat password"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.btn}>
            Register
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>

        <Link href="/login" className="relative top-2 text-xl">
          already registered?{" "}
          <span className={styles.register}>login here</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;
