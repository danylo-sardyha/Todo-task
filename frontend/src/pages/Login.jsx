import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (userData) => api.post("/auth/login", userData),
    onSuccess: (response) => {
      localStorage.setItem("token", response.data.token);
      navigate("/");
    },
    onError: (error) => alert(error.response?.data?.error || "Помилка входу"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Вхід</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Вхід..." : "Увійти"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Немає акаунту?{" "}
          <Link to="/register" className="text-blue-500">
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
