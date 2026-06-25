async function run() {
  const baseUrl = "http://localhost:5000";
  const headers = {
    "Authorization": "Bearer real-company-token",
    "Content-Type": "application/json"
  };

  const inviteBody = {
    expertId: "b2629764-c00d-4f36-b10e-baa204e9da4b",
    requirementId: "cc3d7c00-66d9-4bd4-809f-ee7d4482fedc",
    note: "Let's work together!"
  };

  try {
    const res = await fetch(`${baseUrl}/api/company/invite`, {
      method: "POST",
      headers,
      body: JSON.stringify(inviteBody)
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
run();
