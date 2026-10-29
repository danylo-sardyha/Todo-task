import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all"); // all, todo, in progress, done
  const queryClient = useQueryClient();

  // Отримання завдань
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", filter],
    queryFn: async () => {
      const params = filter !== "all" ? { status: filter } : {};
      const response = await api.get("/tasks", { params });
      return response.data;
    },
  });

  // Створення завдання
  const createMutation = useMutation({
    mutationFn: (newTask) => api.post("/tasks", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setTitle("");
      setDescription("");
    },
  });

  // Оновлення статусу
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, title, description }) =>
      api.put(`/tasks/${id}`, { status, title, description }),
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  // Видалення завдання
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title) return;
    createMutation.mutate({ title, description });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Мої завдання</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Вийти
        </button>
      </div>

      {/* Форма створення */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Нове завдання</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Назва завдання..."
            className="w-full px-4 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Опис (необов'язково)..."
            className="w-full px-4 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded self-end hover:bg-blue-600"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Додавання..." : "Додати"}
          </button>
        </div>
      </form>

      {/* Фільтрація */}
      <div className="flex gap-2 mb-6">
        {["all", "todo", "in progress", "done"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded capitalize ${filter === status ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Список завдань */}
      {isLoading ? (
        <p>Завантаження завдань...</p>
      ) : (
        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500">Завдань не знайдено.</p>
          ) : null}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-blue-500"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-600 mt-1">{task.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({
                      id: task.id,
                      status: e.target.value,
                      title: task.title,
                      description: task.description,
                    })
                  }
                  className="border p-2 rounded bg-gray-50"
                >
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={() => deleteMutation.mutate(task.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
