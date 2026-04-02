import { useState } from "react";
import Head from "next/head";

const initialForm = {
  address: "",
  price: "",
  beds: "",
  baths: "",
  sqft: "",
  type: "Single Family Home",
  features: "",
  neighborhood: "",
  notes: "",
};

const tabs = [
  { key: "instagram_caption", label: "Instagram Caption" },
  { key: "email_blast", label: "Email Blast" },
  { key: "listing_description", label: "MLS Description" },
];

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("instagram_caption");
  const [copied, setCopied] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    const required = ["address", "price", "beds", "baths", "features"];
    for (const field of required) {
      if (!form[field].trim()) {
        setError("Please fill in address, price, beds, baths, and key features.");
        return;
      }
    }
    setError("");
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOutput(data);
      setActiveTab("instagram_caption");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleReset = () => {
    setForm(initialForm);
    setOutput(null);
    setError("");
  };

  return (
    <>
      <Head>
        <title>Listing Generator · Paige Bieker</title>
        <meta name="description" content="AI listing content generator for Paige Bieker at McPherson Sisters Homes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx>{`
        .header {
          background: var(--black);
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--cream);
          letter-spacing: 0.02em;
        }
        .header-sub {
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 3px;
          font-weight: 300;
        }
        .header-badge {
          background: var(--gold);
          color: var(--black);
          font-size: 10px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 2px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .main {
          max-width: 820px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }
        .section-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .field label {
          font-size: 11px;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .field input,
        .field select,
        .field textarea {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 10px 13px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: var(--black);
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: var(--gold);
        }
        .field textarea {
          resize: vertical;
          min-height: 90px;
          line-height: 1.6;
        }
        .field select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        .form-full {
          margin-bottom: 14px;
        }
        .btn-primary {
          width: 100%;
          background: var(--black);
          color: var(--cream);
          border: none;
          border-radius: 4px;
          padding: 15px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 8px;
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--gold);
          color: var(--black);
        }
        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
          color: #888;
        }
        .btn-secondary {
          width: 100%;
          background: none;
          border: 1px solid var(--border);
          color: var(--muted);
          border-radius: 4px;
          padding: 11px;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 8px;
          transition: all 0.15s;
        }
        .btn-secondary:hover {
          border-color: #999;
          color: #555;
        }
        .error-box {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 4px;
          padding: 10px 14px;
          font-size: 13px;
          color: #B91C1C;
          margin-top: 10px;
        }
        .loading-box {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 56px 32px;
          text-align: center;
          margin-top: 32px;
        }
        .spinner {
          width: 28px;
          height: 28px;
          border: 2px solid var(--border);
          border-top-color: var(--gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-label {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .divider {
          height: 1px;
          background: var(--border);
          margin: 36px 0;
        }
        .output-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .output-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 500;
        }
        .ready-pill {
          background: var(--green-bg);
          color: var(--green);
          font-size: 11px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 20px;
        }
        .tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
          margin-bottom: 20px;
          gap: 0;
        }
        .tab-btn {
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          cursor: pointer;
          border: none;
          border-bottom: 2px solid transparent;
          background: none;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          transition: all 0.15s;
          margin-bottom: -1px;
        }
        .tab-btn:hover { color: #555; }
        .tab-btn.active {
          color: var(--black);
          border-bottom-color: var(--gold);
        }
        .content-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 24px;
          position: relative;
          min-height: 200px;
        }
        .content-text {
          font-size: 14px;
          color: #333;
          line-height: 1.85;
          white-space: pre-wrap;
          font-family: 'DM Sans', sans-serif;
          padding-right: 80px;
        }
        .copy-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--black);
          color: var(--cream);
          border: none;
          border-radius: 3px;
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .copy-btn:hover { background: var(--gold); color: var(--black); }
        .copy-btn.copied { background: var(--green); }
        .copy-all-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .copy-all-btn {
          flex: 1;
          min-width: 140px;
          background: none;
          border: 1px solid var(--border);
          color: #555;
          border-radius: 4px;
          padding: 9px 10px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: all 0.15s;
        }
        .copy-all-btn:hover { border-color: var(--gold); color: var(--black); }
        .copy-all-btn.copied { background: var(--green-bg); border-color: #4ADE80; color: var(--green); }
        .tips-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 20px 24px;
          margin-top: 14px;
        }
        .tips-title {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 12px;
        }
        .tip {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }
        .tip-key {
          font-weight: 500;
          color: var(--black);
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .header { padding: 20px; }
          .main { padding: 24px 16px 60px; }
          .tab-btn { padding: 10px 12px; font-size: 11px; }
        }
      `}</style>

      <div className="header">
        <div>
          <div className="header-title">Listing Content Generator</div>
          <div className="header-sub">Paige Bieker · McPherson Sisters Homes</div>
        </div>
        <div className="header-badge">AI Powered</div>
      </div>

      <div className="main">
        <div className="section-label">Listing details</div>

        <div className="form-grid">
          <div className="field">
            <label>Property address *</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="123 Lakeview Dr, Wayzata MN" />
          </div>
          <div className="field">
            <label>Listing price *</label>
            <input name="price" value={form.price} onChange={handleChange} placeholder="750000" type="number" />
          </div>
          <div className="field">
            <label>Bedrooms *</label>
            <input name="beds" value={form.beds} onChange={handleChange} placeholder="4" type="number" />
          </div>
          <div className="field">
            <label>Bathrooms *</label>
            <input name="baths" value={form.baths} onChange={handleChange} placeholder="3.5" />
          </div>
          <div className="field">
            <label>Square footage</label>
            <input name="sqft" value={form.sqft} onChange={handleChange} placeholder="3,200" />
          </div>
          <div className="field">
            <label>Property type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Single Family Home</option>
              <option>Luxury Estate</option>
              <option>Townhome</option>
              <option>Condo</option>
              <option>New Construction</option>
              <option>Waterfront</option>
              <option>Acreage / Hobby Farm</option>
            </select>
          </div>
        </div>

        <div className="form-full field">
          <label>Key features * (the standout details)</label>
          <textarea
            name="features"
            value={form.features}
            onChange={handleChange}
            placeholder="Chef's kitchen with quartz countertops, primary suite with spa bath, 3-car garage, finished walkout basement with wet bar, new roof 2024, lake views from main floor..."
          />
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Neighborhood / area vibe</label>
            <input name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="Wayzata, quiet cul-de-sac, lake community..." />
          </div>
          <div className="field">
            <label>Special angle or urgency</label>
            <input name="notes" value={form.notes} onChange={handleChange} placeholder="First time on market, priced to move fast..." />
          </div>
        </div>

        <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating your content..." : "Generate all 3 pieces of content →"}
        </button>

        {output && (
          <button className="btn-secondary" onClick={handleReset}>
            Start over with a new listing
          </button>
        )}

        {error && <div className="error-box">{error}</div>}

        {loading && (
          <div className="loading-box">
            <div className="spinner" />
            <div className="loading-label">Writing your listing content...</div>
          </div>
        )}

        {output && (
          <>
            <div className="divider" />

            <div className="output-header">
              <div className="output-title">Your listing content</div>
              <div className="ready-pill">Ready to use</div>
            </div>

            <div className="tabs">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={`tab-btn${activeTab === t.key ? " active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="content-card">
              <button
                className={`copy-btn${copied === activeTab ? " copied" : ""}`}
                onClick={() => handleCopy(activeTab, output[activeTab])}
              >
                {copied === activeTab ? "Copied!" : "Copy"}
              </button>
              <div className="content-text">{output[activeTab]}</div>
            </div>

            <div className="copy-all-row">
              {tabs.map((t) => (
                <button
                  key={t.key + "_all"}
                  className={`copy-all-btn${copied === t.key + "_all" ? " copied" : ""}`}
                  onClick={() => handleCopy(t.key + "_all", output[t.key])}
                >
                  {copied === t.key + "_all" ? "✓ Copied" : `Copy ${t.label}`}
                </button>
              ))}
            </div>

            <div className="tips-card">
              <div className="tips-title">How to use each piece</div>
              <div className="tip"><span className="tip-key">Instagram —</span> Add your listing photos or walkthrough video. Review the caption and tweak any details before posting.</div>
              <div className="tip"><span className="tip-key">Email blast —</span> Paste into Follow Up Boss, Mailchimp, or your CRM. Replace the phone/email placeholders with your real info.</div>
              <div className="tip"><span className="tip-key">MLS description —</span> Copy directly into your MLS input. Verify all details against the actual property before submitting.</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
