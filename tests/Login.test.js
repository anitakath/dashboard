import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login/Login.js"; // Pfad zur Login-Komponente anpassen
import { useAuth } from "../custom-hooks/auth/useAuth"; // Pfad zu useAuth anpassen
import { useRouter } from "next/router";

jest.mock("../path/to/auth", () => ({
  useAuth: jest.fn(),
}));

// Mock der useRouter Hook
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));


describe("Login Component", () => {
  const mockLoginHandler = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ loginHandler: mockLoginHandler });
    useRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("renders login form", () => {
    render(<Login successMessage={null} />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("handles input change", () => {
    render(<Login successMessage={null} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits the form and calls loginHandler", async () => {
    render(<Login successMessage={null} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await new Promise((r) => setTimeout(r, 0)); // Warten auf asynchrone Operationen

    expect(mockLoginHandler).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });
  test("displays error message on failed login", async () => {
    mockLoginHandler.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<Login successMessage={null} />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await new Promise((r) => setTimeout(r, 0)); // Warten auf asynchrone Operationen

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});



/*

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
*/