import { useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/;`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      alert(error.response?.data?.message || "登入失敗");
    }
  };
  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={onSubmit}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <label>Email</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <label>Password</label>
        </div>
        <button className="btn btn-primary mt-3 w-100">登入</button>
      </form>
    </div>
  );
}

export default Login;
