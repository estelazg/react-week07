import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "./views/Login";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({});
  const productModalInstance = useRef(null);

  const handleModalInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setTemplateProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUrlChange = (index, value) => {
    setTemplateProduct((prev) => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl[index] = value;
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  const handleAddImage = () => {
    setTemplateProduct((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ""],
    }));
  };

  const handleRemoveImage = () => {
    setTemplateProduct((prev) => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl.pop();
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  // 取得列表
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData,
      );
      setTemplateProduct((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl,
      }));
    } catch (error) {
      alert(error.response?.data?.message || "圖片上傳失敗");
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("productModal");
    if (modalElement) {
      productModalInstance.current = new bootstrap.Modal(modalElement, {
        keyboard: false,
      });
    }

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];

    if (token) {
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      getProducts();
    }
  }, [isAuth]);

  const openModal = (type, item = INITIAL_TEMPLATE_DATA) => {
    setModalType(type);
    setTemplateProduct({
      ...INITIAL_TEMPLATE_DATA,
      ...item,
      imagesUrl: Array.isArray(item.imagesUrl) ? item.imagesUrl : [],
    });
    productModalInstance.current?.show();
  };

  const closeModal = () => {
    productModalInstance.current?.hide();
  };

  const handleConfirm = async () => {
    const id = templateProduct.id;
    let url = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = "post";

    if (modalType === "edit") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "put";
    } else if (modalType === "delete") {
      url = `${API_BASE}/api/${API_PATH}/admin/product/${id}`;
      method = "delete";
    }

    const productData = {
      data: {
        ...templateProduct,
        origin_price: Number(templateProduct.origin_price),
        price: Number(templateProduct.price),
        is_enabled: templateProduct.is_enabled ? 1 : 0,
      },
    };

    try {
      if (modalType === "delete") {
        await axios.delete(url);
      } else {
        await axios[method](url, productData);
      }
      getProducts();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "操作失敗");
    }
  };

  return (
    <>
      {!isAuth ? (
        <Login getProducts={getProducts} setIsAuth={setIsAuth} />
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              className="btn btn-primary"
              onClick={() => openModal("create")}
            >
              建立新的產品
            </button>
          </div>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>分類</th>
                <th>名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>狀態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.category}</td>
                  <td>{item.title}</td>
                  <td>{item.origin_price}</td>
                  <td>{item.price}</td>
                  <td className={item.is_enabled ? "text-success" : ""}>
                    {item.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => openModal("edit", item)}
                    >
                      編輯
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal("delete", item)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={getProducts} />
        </div>
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        handleModalInputChange={handleModalInputChange}
        handleImageUrlChange={handleImageUrlChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        closeModal={closeModal}
        handleConfirm={handleConfirm}
        uploadImage={uploadImage}
      />
    </>
  );
}

export default App;
