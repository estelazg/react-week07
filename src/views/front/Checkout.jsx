import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState({});
  const [tempProduct, setTempProduct] = useState({}); // 存放 Modal 顯示的單一產品
  const [loadingCartID, setLoadingCartID] = useState(null);
  const [loadingProductID, setLoadingProductID] = useState(null);

  // 修正：統一使用 productModalRef
  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  // 取得購物車資料
  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartData(response.data.data);
    } catch (error) {
      console.error("取得購物車失敗", error.response);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error(error.response);
      }
    };
    getProducts();
    getCart();

    // 初始化 Bootstrap Modal
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
  }, []);

  // 加入購物車
  const addCart = async (id, qty = 1) => {
    setLoadingCartID(id);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: { product_id: id, qty: Number(qty) },
      });
      alert("成功加入購物車！");
      await getCart();
    } catch (error) {
      alert(error.response?.data?.message || "加入失敗");
    } finally {
      setLoadingCartID(null);
    }
  };

  // 更新購物車數量
  const updateCart = async (cartId, productId, qty) => {
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {
        data: { product_id: productId, qty: Number(qty) },
      });
      getCart();
    } catch (error) {
      console.error("更新失敗", error.response);
    }
  };

  // 刪除單一品項
  const deleteCart = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      alert("刪除失敗");
    }
  };

  // 清空購物車
  const deleteCartAll = async () => {
    if (!window.confirm("確定要清空嗎？")) return;
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      getCart();
    } catch (error) {
      alert("清空失敗");
    }
  };

  // 送出訂單
  const onSubmit = async (formData) => {
    const { message, ...user } = formData;
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data: { user, message },
      });
      alert("訂單已送出！");
      reset();
      getCart();
    } catch (error) {
      alert(error.response?.data?.message || "送出失敗");
    }
  };

  // 查看更多（開啟 Modal）
  const handleView = async (id) => {
    setLoadingProductID(id);
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`,
      );
      setTempProduct(response.data.product);
      productModalRef.current.show();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProductID(null);
    }
  };
  const closeModal = () => {
    productModalRef.current.hide();
  };
  return (
    <div className="container">
      {/* 1. 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>{product.title}</td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleView(product.id)}
                    disabled={loadingProductID === product.id}
                  >
                    {loadingProductID === product.id ? (
                      <RotatingLines
                        height="20"
                        width="20"
                        strokeColor="#3d3d3d"
                        strokeWidth="5"
                        animationDuration="0.75"
                        wrapperStyle={{}}
                        wrapperClassName=""
                      />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => addCart(product.id)}
                    disabled={loadingCartID === product.id}
                  >
                    {loadingCartID === product.id ? (
                      <RotatingLines
                        height="20"
                        width="20"
                        strokeColor="#f11010"
                        strokeWidth="5"
                        animationDuration="0.75"
                        wrapperStyle={{}}
                        wrapperClassName=""
                      />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 2. 購物車列表 */}
      <div className="mt-5">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={deleteCartAll}
          >
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>品名</th>
              <th style={{ width: "150px" }}>數量/單位</th>
              <th className="text-end">小計</th>
            </tr>
          </thead>
          <tbody>
            {cartData.carts?.map((cartItem) => (
              <tr key={cartItem.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteCart(cartItem.id)}
                  >
                    刪除
                  </button>
                </td>
                <td>{cartItem.product.title}</td>
                <td>
                  <div className="input-group input-group-sm">
                    <input
                      type="number"
                      className="form-control text-center"
                      min="1"
                      value={cartItem.qty}
                      onChange={(e) =>
                        updateCart(
                          cartItem.id,
                          cartItem.product.id,
                          e.target.value,
                        )
                      }
                    />
                    <span className="input-group-text">
                      {cartItem.product.unit}
                    </span>
                  </div>
                </td>
                <td className="text-end">${currency(cartItem.final_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">
                ${currency(cartData.final_total || 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 3. 結帳表單 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="請輸入 Email"
              {...register("email", {
                required: "請輸入 Email",
                pattern: { value: /^\S+@\S+$/i, message: "Email 格式不正確" },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="請輸入姓名"
              {...register("name", {
                required: "請輸入姓名",
                minLength: { value: 2, message: "姓名最少2個字" },
              })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="tel"
              className={`form-control ${errors.tel ? "is-invalid" : ""}`}
              placeholder="請輸入電話"
              {...register("tel", {
                required: "請輸入電話",
                pattern: { value: /^\d+$/, message: "電話格式不正確" },
                minLength: { value: 8, message: "電話號碼至少8位數" },
              })}
            />
            {errors.tel && (
              <div className="invalid-feedback">{errors.tel.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="請輸入地址"
              {...register("address", { required: "請輸入地址" })}
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="5"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={cartData.carts?.length === 0}
            >
              送出訂單
            </button>
          </div>
        </form>
      </div>

      {/* 4. Modal 組件 */}
      <SingleProductModal
        product={tempProduct}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
}

export default Checkout;
