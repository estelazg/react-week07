import React from "react";
// 修正：必須匯入 useSelector 才能使用 Redux 資料
import { useSelector } from "react-redux";
import { createAsyncMessage } from "../Slice/messageSlice";
import { useDispatch } from "react-redux";
import useMessage from "../hooks/useMessage";

function MessageToast({ message, onClose }) {
  // 修正：加上 || [] 防止 state.message 為空時 map 報錯
  const messages = useSelector((state) => state.message || []);

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="toast show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className={`toast-header text-white bg-${msg.type}  `}>
            <strong className="me-auto">{msg.title}</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => onClose && onClose(msg.id)} // 建議加上點擊事件
            ></button>
          </div>
          <div className="toast-body">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageToast;
