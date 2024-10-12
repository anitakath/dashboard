
// Login.test.js
import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from 'react-redux';
import { store } from '../store';
import Login from '../components/Login/Login'; // Pfad zur Login-Komponente anpassen
import { useRouter } from 'next/router';
import rootReducer from '../store'

// Pfad zur Login-Komponente anpassen
//import { useAuth } from "../custom-hooks/auth/useAuth"; // Pfad zu useAuth anpassen


// Mocking des useRouter-Hooks von Next.js
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


// Mocke das useAuth-Modul
jest.mock("../custom-hooks/auth/useAuth", () => ({
  __esModule: true,
  default: () => ({
    loginHandler: jest
      .fn()
      .mockRejectedValueOnce(new Error("Invalid credentials")),
  }),
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Reset der Router-Mock vor jedem Test
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
  });

  test("renders Login component successfully", () => {
    const { getByText } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    // Hier kannst du weitere Assertions hinzufügen
    expect(getByText(/login/i)).toBeInTheDocument(); // Beispiel für eine Assertion
  });

  test("renders email and password input fields", () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });
  /*
  test("displays error message on failed login", async () => {
    const { getByPlaceholderText, getByRole } = render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    // Simuliere das Ausfüllen der Felder
    fireEvent.change(getByPlaceholderText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(getByPlaceholderText(/password/i), {
      target: { value: "wrong-password" },
    });

    // Simuliere das Absenden des Formulars
    fireEvent.click(getByRole("button", { name: /login/i }));

    // Überprüfe, ob die Fehlermeldung angezeigt wird
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

      test("displays error message on failed login", async () => {
        const { getByPlaceholderText, getByRole } = render(
          <Provider store={store}>
            <Login />
          </Provider>
        );

        // Simuliere das Ausfüllen der Felder
        fireEvent.change(getByPlaceholderText(/email/i), {
          target: { value: "invalid-email" },
        });
        fireEvent.change(getByPlaceholderText(/password/i), {
          target: { value: "wrong-password" },
        });

        // Simuliere das Absenden des Formulars
        fireEvent.click(getByRole("button", { name: /login/i }));

        // Überprüfe, ob die Fehlermeldung angezeigt wird
        expect(await screen.findByText(/error message/i)).toBeInTheDocument(); // Ersetze "error message" durch die tatsächliche Fehlermeldung
      });


         test("shows input errors when fields are empty on submit", async () => {
           const { getByRole } = render(
             <Provider store={store}>
               <Login />
             </Provider>
           );

           // Simuliere das Absenden des Formulars ohne Eingaben
           fireEvent.click(getByRole("button", { name: /login/i }));

           // Überprüfe, ob die Eingabefelder als fehlerhaft markiert sind
           expect(screen.getByPlaceholderText(/email/i)).toHaveClass(
             styles.error_input
           );
           expect(screen.getByPlaceholderText(/password/i)).toHaveClass(
             styles.error_input
           );
         });
      

         test("redirects to home on successful login", async () => {
       const mockPush = jest.fn();

       useRouter.mockImplementation(() => ({ push: mockPush }));

       const mockLoginHandler = jest.fn().mockResolvedValueOnce({});

       jest.mock('../../custom-hooks/auth/useAuth', () => ({
           __esModule: true,
           default: () => ({ loginHandler: mockLoginHandler }),
       }));

       const { getByPlaceholderText, getByRole } = render(
           <Provider store={store}>
               <Login />
           </Provider>
       );

       // Simuliere das Ausfüllen der Felder mit gültigen Daten
       fireEvent.change(getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
       fireEvent.change(getByPlaceholderText(/password/i), { target: { value: 'correct-password' } });

       // Simuliere das Absenden des Formulars
       fireEvent.click(getByRole('button', { name: /login/i }));

       await waitFor(() => {
           expect(mockPush).toHaveBeenCalledWith("/");
       });
   });

      test("renders registration link", () => {
      render(
          <Provider store={store}>
              <Login />
          </Provider>
      );
      expect(screen.getByText(/not registered yet?/i)).toBeInTheDocument();
      expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });
         
         */
});


