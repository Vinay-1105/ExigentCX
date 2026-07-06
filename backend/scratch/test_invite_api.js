

async function testApi() {
  const baseUrl = "http://localhost:5000";
  const headers = {
    "Authorization": "Bearer mock-token",
    "Content-Type": "application/json"
  };

  console.log("=== Testing GET /api/company/requirements ===");
  try {
    const reqsRes = await fetch(`${baseUrl}/api/company/requirements`, { headers });
    if (!reqsRes.ok) {
      console.error("Failed to fetch requirements:", reqsRes.status, await reqsRes.text());
      return;
    }
    const requirements = await reqsRes.json();
    console.log("Requirements response:", requirements);

    if (requirements.length === 0) {
      console.warn("No requirements returned. Seeding might have failed or not run.");
      return;
    }

    const testReqId = requirements[0].id;
    console.log(`Using requirement ID for matching: ${testReqId}`);

    console.log("\n=== Testing GET /api/company/experts?requirementId=<id> ===");
    const expertsRes = await fetch(`${baseUrl}/api/company/experts?requirementId=${testReqId}`, { headers });
    if (!expertsRes.ok) {
      console.error("Failed to fetch experts:", expertsRes.status, await expertsRes.text());
      return;
    }
    const experts = await expertsRes.json();
    console.log(`Found ${experts.length} experts with matchmaking scores:`);
    experts.slice(0, 3).forEach(e => {
      console.log(`- ${e.name} (${e.title}): Match score = ${e.match}%`);
    });

    if (experts.length === 0) {
      console.warn("No experts registered in database.");
      return;
    }
    const testExpertId = experts[0].id;

    console.log("\n=== Testing POST /api/company/invite ===");
    const inviteBody = {
      expertId: testExpertId,
      requirementId: testReqId,
      note: "Hi, we are highly interested in your profile for our CFO position. Let's connect!"
    };

    const inviteRes = await fetch(`${baseUrl}/api/company/invite`, {
      method: "POST",
      headers,
      body: JSON.stringify(inviteBody)
    });

    if (!inviteRes.ok) {
      console.error("Failed to send invitation:", inviteRes.status, await inviteRes.text());
      return;
    }

    const inviteResult = await inviteRes.json();
    console.log("Invitation API response:", inviteResult);

    if (inviteResult.success) {
      console.log("\n✅ All API endpoints verified successfully!");
    } else {
      console.error("\n❌ Invitation response did not indicate success.");
    }
  } catch (err) {
    console.error("Error during API testing:", err);
  }
}

testApi();
