import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Signup
    const [formData, setFormData] = useState({ username: "", password: "", role: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ username: "", password: "", role: "" }); // Reset form
        setError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const url = isLogin ? "http://localhost:8080/api/auth/signin" : "http://localhost:8080/api/auth/signup";
            const response = await axios.post(url, formData, { withCredentials: true });

            if (isLogin) {
                // Store the JWT token in cookies with expiration of 1 day
                Cookies.set("token", response.data.token, { expires: 1 });

                // Optionally store other user details, such as role or username
                if (response.data.user) {
                    Cookies.set("username", response.data.user.username, { expires: 1 });
                    Cookies.set("role", response.data.user.role, { expires: 1 });
                }

                navigate("/reports"); // Redirect to home after login
            } else {
                alert("Signup successful! Please login.");
                toggleForm();
            }
        } catch (err) {
            // Handle the error better here by extracting the message
            const errorMessage = err.response?.data || "Something went wrong";
            setError(errorMessage);
        }
    };


    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>{isLogin ? "Login" : "Signup"}</h2>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    {!isLogin && (
                        <input
                            type="text"
                            name="role"
                            placeholder="Role (USER/ADMIN)"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    )}

                    <button type="submit" style={styles.button}>
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>

                <p style={styles.switchText}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button onClick={toggleForm} style={styles.switchButton}>
                        {isLogin ? "Signup" : "Login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
    },
    card: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        width: "400px",
    },
    header: {
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "16px",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "4px",
        border: "none",
        fontSize: "16px",
        cursor: "pointer",
    },
    switchText: {
        textAlign: "center",
        marginTop: "16px",
    },
    switchButton: {
        color: "#007bff",
        textDecoration: "underline",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
};

export default AuthPage;
