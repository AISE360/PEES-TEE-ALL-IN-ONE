import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { SITE } from "../../data/site";

const STAGES = ["APPLIED", "CONNECTED", "IN_PROCESSING", "COMPLETED"];

export default function Track() {
  const [params] = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") || "");
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const lookup = async (value?: string) => {
    const v = (value ?? ref).trim().toUpperCase();
    if (!v) { setErr("Enter your PT reference — e.g. PT48213."); return; }
    setBusy(true); setErr(""); setResult(null);
    try {
      const r = await apiFetch("/api/client-requests");
      const items: any[] = r.data || [];
      const hit = items.find(x => (x.reference || "").toUpperCase() === v);
      if (hit) setResult(hit);
      else setErr(`No live record for ${v} on this demo server. Call ${SITE.helpline} with your reference for an instant update.`);
    } catch {
      setErr(`Tracker is offline right now — WhatsApp/call ${SITE.helpline} with your reference for an instant update.`);
    }
    setBusy(false);
  };

  useEffect(() => {
    const preset = params.get("ref");
    if (preset) { setRef(preset); lookup(preset); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const idx = result ? STAGES.indexOf(result.stage) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#A88A4A]">Track</div>
      <h1 className="font-display font-bold text-[#0F2440] text-3xl tracking-tight mt-1">Track your application</h1>
      <p className="text-slate-500 mt-2 text-[15px]">Every file carries a <span className="font-mono font-bold text-[#0F2440]">PT + 5-digit</span> reference issued at intake — by SMS, email and stamped receipt.</p>

      <form onSubmit={e => { e.preventDefault(); lookup(); }} className="flex gap-2 mt-6">
        <input value={ref} onChange={e => setRef(e.target.value.toUpperCase())} placeholder="e.g. PT48213"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 font-mono uppercase text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A664]/60" />
        <button disabled={busy} className="px-6 py-3 rounded-xl bg-[#0F2440] text-white text-sm font-bold disabled:opacity-60 btn-press">
          {busy ? "…" : "Track"}
        </button>
      </form>

      {err && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{err}</div>}

      {result && (
        <div className="mt-6 rounded-3xl border border-slate-200 overflow-hidden">
          <div className="bg-[#0F2440] text-white px-6 py-5 flex justify-between items-center">
            <div>
              <div className="font-mono font-bold text-lg">{result.reference}</div>
              <div className="text-sm text-white/60">{result.serviceType}</div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#C6A664] text-[#0F2440]">{result.stage.replace("_", " ")}</span>
          </div>
          <div className="p-6">
            <div className="flex items-center">
              {STAGES.map((s, i) => (
                <div key={s} className="flex-1 flex items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${i <= idx ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {i <= idx ? "✓" : i + 1}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 mt-1 text-center leading-tight w-16">{s.replace("_", " ")}</div>
                  </div>
                  {i < STAGES.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-5 rounded ${i < idx ? "bg-emerald-500" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
            <div className="mt-5 text-sm text-slate-600 space-y-1.5">
              <div><b className="text-[#0F2440]">Service:</b> {result.serviceType}</div>
              <div><b className="text-[#0F2440]">Description:</b> {result.description}</div>
              <div><b className="text-[#0F2440]">Last update:</b> {new Date(result.updatedAt).toLocaleString()}</div>
            </div>
            {(result.stageHistory || []).length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[12px] font-bold text-[#0F2440] uppercase tracking-wider mb-3">Milestone history</div>
                <div className="space-y-2.5">
                  {result.stageHistory.map((h: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C6A664] mt-1.5 shrink-0" />
                      <div><b>{h.stage.replace("_", " ")}</b><span className="text-slate-400 text-[12px]"> · {new Date(h.at).toLocaleString()}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-500">
        Lost your reference? <Link to="/contact" className="font-bold text-[#0F2440]">Send us your name + phone</Link> or call <a className="font-bold text-[#0F2440]" href={`tel:${SITE.helpline.replace(/\s/g, "")}`}>{SITE.helpline}</a> — we'll resend it with the government acknowledgment number.
      </div>
    </div>
  );
}
