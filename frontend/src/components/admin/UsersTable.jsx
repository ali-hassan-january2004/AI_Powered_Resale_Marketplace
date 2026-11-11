import BlockUserButton from "./BlockUserButton";
import StatusBadge from "../commerce/StatusBadge";

export default function UsersTable({ users = [], onToggleBlock, loading = false }) {
  if (loading) return <p className="py-8 text-center text-sm text-stone-500">Loading users…</p>;
  if (!users.length) return <p className="py-8 text-center text-sm text-stone-500">No users found.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {users.map((u) => (
            <tr key={u._id}>
              <td className="px-4 py-3 font-medium">{u.name}</td>
              <td className="px-4 py-3 text-stone-600">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role}</td>
              <td className="px-4 py-3 text-stone-600">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {u.isBlocked ? <StatusBadge status="removed" className="!capitalize" /> : <StatusBadge status="active" />}
              </td>
              <td className="px-4 py-3 text-right">
                <BlockUserButton user={u} onToggle={onToggleBlock} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}