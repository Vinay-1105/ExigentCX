async function run() {
  const baseUrl = "http://localhost:5001";
  const headers = {
    "Authorization": "Bearer company-token"
  };

  try {
    const res = await fetch(`${baseUrl}/api/company/profile`, { headers });
    if (!res.ok) {
      console.error("API error:", res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log("Profile response for demo@cxo.com from backend:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

run();
