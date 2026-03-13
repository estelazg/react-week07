import { useState, useEffect } from "react";
import axios from "axios";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cartData, setCartData] = useState({});

  const getCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCartData(response.data.data);
    } catch (error) {
      console.error("取得購物車失敗", error.response);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateCart = async (cartId, productId, qty) => {
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {
        data: {
          product_id: productId,
          qty: qty,
        },
      });
      getCart();
    } catch (error) {
      console.error("更新購物車失敗", error.response);
    }
  };

  // 清除單一筆購物車
  const deleteCart = async (id) => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart/${id}`;
      await axios.delete(url);
      alert(`商品已從購物車刪除`);
      getCart();
    } catch (error) {
      console.error("刪除品項失敗", error.response);
      alert("刪除失敗，請稍後再試");
    }
  };

  // 清空購物車
  const deleteCartAll = async () => {
    if (!window.confirm("確定要清空整個購物車嗎？")) return;
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);
      alert("購物車已清空！");
      getCart();
    } catch (error) {
      console.error("清空購物車失敗", error.response);
      alert("清空購物車失敗，請稍後再試");
    }
  };

  return (
    <div className="container">
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
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th scope="col" className="text-end">
              小計
            </th>
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
              <th scope="row">{cartItem.product.title}</th>
              <td>
                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={cartItem.qty}
                    onChange={(e) =>
                      updateCart(
                        cartItem.id,
                        cartItem.product.id,
                        Number(e.target.value),
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
            <td className="text-end">${currency(cartData.final_total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Cart;
