import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <>
      <header>
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/admin/product">
              後臺產品列表
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/order">
              後臺訂單列表
            </Link>
          </li>
        </ul>
      </header>

      <main>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>&copy; 2025 我的網站 All rights reserved.</p>
      </footer>
    </>
  );
}

export default AdminLayout;
