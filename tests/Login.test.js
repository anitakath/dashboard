import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login"; // Pfad zur Login-Komponente anpassen
import { useAuth } from "../../hooks/useAuth"; // Pfad zu useAuth anpassen

jest.mock("../../hooks/useAuth"); // Mocking des useAuth Hooks

describe("Login Component", () => {
  const mockLoginHandler = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ loginHandler: mockLoginHandler });
    render(<Login successMessage={null} />);
  });

  test("renders login form", () => {
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("submits the form with email and password", async () => {
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(mockLoginHandler).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  test("displays error message on failed login", async () => {
    const errorMessage = "Invalid credentials";
    mockLoginHandler.mockRejectedValueOnce(new Error(errorMessage));

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
