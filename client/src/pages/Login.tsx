import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { setToken, isAuthenticated } from "../utils/auth";
import { ROUTES } from "../utils/constants";
import { AuthResponse } from "../types";
import AnimatedCharacter from "../components/AnimatedCharacter";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorTrigger, setErrorTrigger] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate]);

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.leftSection}>
          <div className={styles.imageSection}>
            <AnimatedCharacter 
              showPassword={showPassword} 
              isTypingPassword={isTypingPassword}
              errorTrigger={errorTrigger}
            />
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.loginForm}>
            <div className={styles.logoSection}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor"/>
                </svg>
              </div>
              <h1 className={styles.title}>Welcome Back</h1>
              <p className={styles.subtitle}>Sign in to your Finance Tracker account</p>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form 
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsTypingPassword(true)}
                    onBlur={() => setIsTypingPassword(false)}
                    className={styles.input}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1751 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (loading) return;

                  setError("");

                  if (!email.trim() || !password.trim()) {
                    setError("Please fill in all fields");
                    setErrorTrigger(prev => prev + 1);
                    return;
                  }

                  if (isRegister && password.length < 6) {
                    setError("Password must be at least 6 characters");
                    setErrorTrigger(prev => prev + 1);
                    return;
                  }

                  setLoading(true);

                  try {
                    const path = isRegister ? "/auth/register" : "/auth/login";
                    const res = await api.post<AuthResponse>(path, { email, password });
                    setToken(res.data.token);
                    navigate(ROUTES.DASHBOARD);
                  } catch (err: any) {
                    const backendMsg = err.response?.data?.message;
                    const errorMessage = backendMsg === "Invalid credentials" 
                      ? "Wrong password, try again!" 
                      : (backendMsg || "Something went wrong. Please try again.");
                    setError(errorMessage);
                    setErrorTrigger(prev => prev + 1);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className={`${styles.submitButton} ${styles.button}`}
              >
                {loading && <span className={styles.loadingSpinner}></span>}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className={styles.footer}>
              <p className={styles.copyright}>Finance Tracker © 2025</p>
              <div className={styles.toggleText}>
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <span className={styles.toggleLink} onClick={toggleMode}>
                  {isRegister ? "Log in" : "Sign up"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
