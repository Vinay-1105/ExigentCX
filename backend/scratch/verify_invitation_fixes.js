async function test() {
  const baseUrl = "http://localhost:5000";
  const headers = {
    "Authorization": "Bearer real-company-token",
    "Content-Type": "application/json"
  };

  console.log("=== Test 1: Fetch company invitations ===");
  try {
    const res = await fetch(`${baseUrl}/api/company/invitations`, { headers });
    console.log("Status:", res.status);
    const invitations = await res.json();
    console.log("Invitations count:", invitations.length);
    console.log("First invitation sample:", JSON.stringify(invitations[0], null, 2));
  } catch (err) {
    console.error("Test 1 error:", err);
  }

  console.log("\n=== Test 2: Invite a mock expert (ID: 2) ===");
  try {
    const res = await fetch(`${baseUrl}/api/company/invite`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        expertId: 2, // numeric mock expert ID
        requirementId: "cc3d7c00-66d9-4bd4-809f-ee7d4482fedc",
        note: "Testing mock expert invite"
      })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test 2 error:", err);
  }

  console.log("\n=== Test 3: Invite a real expert (UUID) ===");
  try {
    const res = await fetch(`${baseUrl}/api/company/invite`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        expertId: "b2629764-c00d-4f36-b10e-baa204e9da4b", // Suyash Tripathi
        requirementId: "cc3d7c00-66d9-4bd4-809f-ee7d4482fedc", // CFO, CMO, COO requirement
        note: "Let's do this!"
      })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test 3 error:", err);
  }
}

test();
