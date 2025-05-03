"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    Title: "",
    Deadline: "",
    Status: false,
    addInfo: "",
    _id: null,
  });
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchTasks(sortBy);
  }, [sortBy]);

  const fetchTasks = async (sort = "date") => {
    const res = await axios.get(`/api/tasks?sort=${sort}`);
    setTasks(res.data.tasks || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        addInfo: form.addInfo || "none",
      };
      if (form._id) {
        await axios.put("/api/tasks", payload);
      } else {
        await axios.post("/api/tasks", payload);
      }
      setForm({ Title: "", Deadline: "", Status: false, addInfo: "", _id: null });
      fetchTasks(sortBy);
    } catch (err) {
      console.error("Submit failed:", err.response?.data || err.message);
    }
  };

  const handleEdit = (task) => {
    setForm({ ...task });
  };

  const handleDelete = async (id) => {
    await axios.delete("/api/tasks", { data: { _id: id } });
    fetchTasks(sortBy);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white">
      <h1 className="text-xl font-normal mb-4 text-gray-800">Task Manager</h1>
      <button >
<LogoutLink>Logout</LogoutLink></button>
      <div className="mb-6 border border-gray-200 p-4 rounded">
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Task title"
            value={form.Title}
            onChange={(e) => setForm({ ...form, Title: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded"
            required
          />
          <input
            type="date"
            value={form.Deadline}
            onChange={(e) => setForm({ ...form, Deadline: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded"
            required
          />
          <input
            type="text"
            placeholder="Additional information (optional)"
            value={form.addInfo}
            onChange={(e) => setForm({ ...form, addInfo: e.target.value })}
            className="w-full p-2 border border-gray-200 rounded"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={form.Status}
              onChange={(e) => setForm({ ...form, Status: e.target.checked })}
            />
            <label htmlFor="status" className="text-gray-600">Completed</label>
          </div>
          <button 
            type="submit" 
            className="bg-gray-100 text-gray-800 border border-gray-300 px-4 py-1 rounded hover:bg-gray-200"
          >
            {form._id ? "Update" : "Add Task"}
          </button>
        </form>
      </div>

      <div className="mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-1 border border-gray-200 rounded text-sm text-gray-700"
        >
          <option value="date">Sort by Deadline</option>
          <option value="completed">Show Completed</option>
          <option value="pending">Show Pending</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks found</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task._id} className="border border-gray-200 p-3 rounded bg-gray-50">
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-gray-800">{task.Title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.Status ? "bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {task.Status ? "Done" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-gray-600">Due: {new Date(task.Deadline).toLocaleDateString()}</p>
              {task.addInfo && task.addInfo !== "none" && (
                <p className="text-sm text-gray-500 mt-1">{task.addInfo}</p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}