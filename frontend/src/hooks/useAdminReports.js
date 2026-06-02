import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function useAdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports/summary");
      setData(res.data);
    } catch (err) {
      console.error("Admin reports load error:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reload: load };
}
