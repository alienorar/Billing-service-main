//彼此

// AccessDenied.tsx
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div>
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/super-admin-panel">Go back to Admin Panel</Link>
    </div>
  );
};

export default AccessDenied;