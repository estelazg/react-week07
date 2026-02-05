function ProductModal({
  modalType,
  templateProduct,
  handleModalInputChange,
  handleImageUrlChange,
  handleAddImage,
  handleRemoveImage,
  closeModal,
  handleConfirm, // 確保這裡正確接收
}) {
  return (
    // 使用 ID 替代 Ref
    <div className="modal fade" id="productModal" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header ${
              modalType === "delete" ? "bg-danger" : "bg-dark"
            } text-white`}
          >
            <h5 className="modal-title">
              {modalType === "create" && "新增產品"}
              {modalType === "edit" && "編輯產品"}
              {modalType === "delete" && "刪除產品"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="fs-4">
                確定要刪除{" "}
                <span className="text-danger">{templateProduct.title}</span>{" "}
                嗎？
              </p>
            ) : (
              <div className="row">
                {/* 圖片區塊 */}
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">主圖網址</label>
                    <input
                      type="text"
                      name="imageUrl"
                      className="form-control"
                      placeholder="請輸入圖片網址"
                      value={templateProduct.imageUrl}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  {templateProduct.imageUrl && (
                    <img
                      className="img-fluid mb-3"
                      src={templateProduct.imageUrl}
                      alt="主圖"
                    />
                  )}

                  {templateProduct.imagesUrl.map((url, index) => (
                    <div key={index} className="mb-3">
                      <label className="form-label">副圖網址 {index + 1}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`圖片網址${index + 1}`}
                        value={url}
                        onChange={(e) =>
                          handleImageUrlChange(index, e.target.value)
                        }
                      />
                      {url && (
                        <img
                          className="img-fluid mt-2"
                          src={url}
                          alt={`副圖 ${index + 1}`}
                        />
                      )}
                    </div>
                  ))}
                  <div className="d-grid gap-2">
                    {templateProduct.imagesUrl.length < 5 &&
                      (templateProduct.imagesUrl.length === 0 ||
                        templateProduct.imagesUrl[
                          templateProduct.imagesUrl.length - 1
                        ] !== "") && (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm d-block w-100"
                          onClick={handleAddImage}
                        >
                          新增圖片
                        </button>
                      )}
                    {templateProduct.imagesUrl.length >= 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-block w-100"
                        onClick={handleRemoveImage}
                      >
                        刪除圖片
                      </button>
                    )}
                  </div>
                </div>

                {/* 資料欄位區塊 */}
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">標題</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={templateProduct.title}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">分類</label>
                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        value={templateProduct.category}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">單位</label>
                      <input
                        type="text"
                        name="unit"
                        className="form-control"
                        value={templateProduct.unit}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">原價</label>
                      <input
                        type="number"
                        min="0"
                        name="origin_price"
                        className="form-control"
                        value={templateProduct.origin_price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">售價</label>
                      <input
                        type="number"
                        min="0"
                        name="price"
                        className="form-control"
                        value={templateProduct.price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <label className="form-label">產品描述</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={templateProduct.description}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">說明內容</label>
                    <textarea
                      name="content"
                      className="form-control"
                      value={templateProduct.content}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_enabled"
                      id="isEnabledProduct"
                      className="form-check-input"
                      checked={templateProduct.is_enabled}
                      onChange={handleModalInputChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="isEnabledProduct"
                    >
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
