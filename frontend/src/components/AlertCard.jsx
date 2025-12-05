// frontend/src/components/AlertCard.jsx
export default function AlertCard({ alert, onMarkRead, onDelete }) {
  return (
    <div className={`p-3 rounded mb-3 border ${alert.level === "high" ? "border-red-300 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{alert.message || (alert.title ?? "Alert")}</div>
          <div className="text-sm text-gray-600">Child: {alert.childId}</div>
          <div className="text-xs text-gray-500">{new Date(alert.createdAt).toLocaleString()}</div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {!alert.read ? (
            <button className="btn btn-xs btn-ghost" onClick={() => onMarkRead(alert._id)}>Mark read</button>
          ) : (
            <span className="text-sm text-green-600">Read</span>
          )}
          {onDelete && <button className="btn btn-xs btn-error" onClick={() => onDelete(alert._id)}>Delete</button>}
        </div>
      </div>
    </div>
  );
}
