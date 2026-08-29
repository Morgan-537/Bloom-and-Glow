import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  loadUsers,
  changeUserRole,
  toggleUserDisabled,
  selectUsers,
  selectUsersStatus,
  selectUsersError,
} from "../../features/admin/usersSlice";

const ROLES = ["customer", "admin", "order_manager"];

export default function AdminUsers() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Users &amp; Roles</h1>
      <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
        Manage customer and staff accounts and their access level
      </p>

      {status === "loading" && (
        <p style={{ color: "var(--color-gray)", marginTop: 24 }}>Loading users...</p>
      )}

      {error && (
        <p style={{ color: "var(--color-danger)", marginTop: 24 }}>{error}</p>
      )}

      {status === "succeeded" && (
        <Card style={{ padding: 0, marginTop: 24 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--color-gray)", fontSize: 11 }}>
                  {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 20, textAlign: "center", color: "var(--color-gray)" }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "14px 20px", fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: "14px 20px", color: "var(--color-gray)" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <select
                          value={u.role}
                          onChange={(e) => dispatch(changeUserRole({ id: u.id, role: e.target.value }))}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)",
                            fontSize: 12,
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <Badge tone={u.disabled ? "danger" : "success"}>
                          {u.disabled ? "Disabled" : "Active"}
                        </Badge>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button
                          onClick={() => dispatch(toggleUserDisabled({ id: u.id, disabled: !u.disabled }))}
                          style={{
                            background: "none",
                            border: "none",
                            color: u.disabled ? "var(--color-success)" : "var(--color-danger)",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          {u.disabled ? "Enable" : "Disable"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
}
