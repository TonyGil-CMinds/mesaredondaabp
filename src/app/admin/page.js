"use client";

import { useState, useEffect } from "react";

const DATE_LABELS = {
  19: "Mar 19 Mayo",
  20: "Mié 20 Mayo",
  21: "Jue 21 Mayo",
};

export default function AdminPage() {
  const [authed, setAuthed]               = useState(false);
  const [password, setPassword]           = useState("");
  const [loginError, setLoginError]       = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter]               = useState("all");
  const [loading, setLoading]             = useState(false);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  async function fetchData() {
    setLoading(true);
    const res = await fetch('/api/admin/registrations');
    if (res.status === 401) { setAuthed(false); return; }
    const { registrations } = await res.json();
    setRegistrations(registrations);
    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      const { error } = await res.json();
      setLoginError(error);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/registrations', { method: 'DELETE' });
    setAuthed(false);
    setRegistrations([]);
    setPassword("");
  }

  function downloadCSV() {
    const rows = [
      ["#", "Nombre", "Apellido", "Correo", "Organización", "Rol", "Fecha", "Registro"],
      ...visible.map((r, i) => [
        i + 1,
        r.nombre,
        r.apellido,
        r.correo,
        r.organizacion,
        r.rol,
        DATE_LABELS[r.fecha] ?? r.fecha,
        new Date(r.createdAt).toLocaleString('es-MX'),
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registros-bpa-${filter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const counts = { 19: 0, 20: 0, 21: 0 };
  registrations.forEach(r => { if (counts[r.fecha] !== undefined) counts[r.fecha]++; });

  const visible = filter === "all"
    ? registrations
    : registrations.filter(r => r.fecha === Number(filter));

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#001919" }}>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16, width: 320, padding: 40, border: "1px solid #DEEE5A22", borderRadius: 12 }}>
          <img src="/images/logoBPA.svg" alt="BPA" style={{ width: 140, margin: "0 auto 8px" }} />
          <h1 style={{ color: "#DEEE5A", fontFamily: "Unbounded, sans-serif", fontSize: 14, textAlign: "center", margin: 0 }}>PANEL DE REGISTROS</h1>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: "12px 16px", background: "#002828", border: "1px solid #DEEE5A44", borderRadius: 8, color: "#FDFFE3", fontFamily: "Outfit, sans-serif", fontSize: 14, outline: "none" }}
            autoFocus
          />
          {loginError && <p style={{ color: "#ff6b6b", fontSize: 13, margin: 0, textAlign: "center" }}>{loginError}</p>}
          <button type="submit" style={{ padding: "12px", background: "#DEEE5A", color: "#001919", border: "none", borderRadius: 8, fontFamily: "Unbounded, sans-serif", fontSize: 13, cursor: "pointer" }}>
            ENTRAR
          </button>
        </form>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#001919", padding: "32px 24px", fontFamily: "Outfit, sans-serif", color: "#FDFFE3" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src="/images/logoBPA.svg" alt="BPA" style={{ height: 36 }} />
            <h1 style={{ color: "#DEEE5A", fontFamily: "Unbounded, sans-serif", fontSize: 16, margin: 0 }}>REGISTROS</h1>
          </div>
          <button onClick={handleLogout} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #DEEE5A44", borderRadius: 8, color: "#FDFFE3aa", fontFamily: "Outfit, sans-serif", fontSize: 13, cursor: "pointer" }}>
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Total", value: registrations.length },
            { label: "Mar 19 Mayo", value: counts[19] },
            { label: "Mié 20 Mayo", value: counts[20] },
            { label: "Jue 21 Mayo", value: counts[21] },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#002828", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontSize: 28, fontFamily: "Unbounded, sans-serif", color: "#DEEE5A" }}>{value}</div>
              <div style={{ fontSize: 12, color: "#FDFFE3aa", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[["all", "Todos"], ["19", "Mar 19"], ["20", "Mié 20"], ["21", "Jue 21"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontFamily: "Outfit, sans-serif", fontSize: 13, cursor: "pointer", background: filter === val ? "#DEEE5A" : "#002828", color: filter === val ? "#001919" : "#FDFFE3aa" }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={fetchData} style={{ padding: "6px 14px", background: "#002828", border: "1px solid #DEEE5A22", borderRadius: 8, color: "#FDFFE3aa", fontFamily: "Outfit, sans-serif", fontSize: 13, cursor: "pointer" }}>
              ↻ Actualizar
            </button>
            <button onClick={downloadCSV} style={{ padding: "6px 14px", background: "#DEEE5A", color: "#001919", border: "none", borderRadius: 8, fontFamily: "Outfit, sans-serif", fontSize: 13, cursor: "pointer" }}>
              ↓ CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#FDFFE3aa", padding: 40 }}>Cargando...</p>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #DEEE5A11" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#002828" }}>
                  {["#", "Nombre", "Apellido", "Correo", "Organización", "Rol", "Fecha", "Registro"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#DEEE5Acc", fontFamily: "Unbounded, sans-serif", fontSize: 11, fontWeight: 400, whiteSpace: "nowrap", borderBottom: "1px solid #DEEE5A11" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#FDFFE3aa" }}>Sin registros</td></tr>
                ) : visible.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #DEEE5A08", background: i % 2 === 0 ? "transparent" : "#ffffff04" }}>
                    <td style={{ padding: "11px 16px", color: "#FDFFE3aa", whiteSpace: "nowrap" }}>{i + 1}</td>
                    <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>{r.nombre}</td>
                    <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>{r.apellido}</td>
                    <td style={{ padding: "11px 16px", color: "#DEEE5A" }}>{r.correo}</td>
                    <td style={{ padding: "11px 16px" }}>{r.organizacion}</td>
                    <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>{r.rol}</td>
                    <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ background: "#DEEE5A22", color: "#DEEE5A", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>
                        {DATE_LABELS[r.fecha] ?? r.fecha}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px", color: "#FDFFE3aa", whiteSpace: "nowrap", fontSize: 12 }}>
                      {new Date(r.createdAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
