import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error(error.response);
      }
    };

    getProduct();
  }, [id]);

  const addCart = async (id) => {
    try {
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: id,
          qty: 1,
        },
      });

      alert("成功加入購物車！");
      console.log(response.data);
    } catch (error) {
      console.error("錯誤詳細資訊:", error.response?.data);
      alert(error.response?.data?.message || "加入購物車失敗");
    }
  };

  if (!product) {
    return <h2>查無產品</h2>;
  }

  return (
    <div className="container mt-3">
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.title}
        />
        <div className="card-body">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <p className="card-text">價格: {product.price}</p>
          <p className="card-text">
            <small className="text-body-secondary">{product.unit}</small>
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addCart(product.id)}
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
