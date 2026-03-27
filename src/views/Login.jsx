import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "test@example.com",
      password: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // const onSubmit = async (formData) => {
  //   try {
  //     const res = await axios.post(`${API_BASE}/admin/signin`, formData);

  //     console.log("API回傳：", res.data); // 👈 加在這裡

  //     const { token, expired } = res.data;

  //     document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/;`;
  //     axios.defaults.headers.common.Authorization = token;

  //     console.log("登入成功");

  //     navigate("/admin/product");
  //   } catch (error) {
  //     alert(error.response?.data?.message || "登入失敗");
  //   }
  // };
  const onSubmit = async (formData) => {
    // e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/;`;
      axios.defaults.headers.common.Authorization = token;
      navigate("/admin/product");
    } catch (error) {
      alert(error.response?.data?.message || "登入失敗");
    }
  };
  return (
    <div className="container login">
      <h1>請先登入</h1>
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            name="username"
            placeholder="name@example.com"
            {...register("username", {
              required: "請輸入 Email",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email 格式不正確",
              },
            })}
            // value={formData.username}
            // onChange={handleInputChange}
            required
          />
          <label>Email</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 6,
                message: "密碼長度至少需 6 碼",
              },
            })}
            // value={formData.password}
            // onChange={handleInputChange}
            required
          />
          <label>Password</label>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <button className="btn btn-primary mt-3 w-100">登入</button>
      </form>
    </div>
  );
}

export default Login;
