import dotenv from "dotenv";
dotenv.config();

async function run() {
  const url = process.env.SUPABASE_URL || "https://mvhptjmouxznfmjgmhbn.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("Fetching OpenAPI spec from:", url);
  try {
    const res = await fetch(url + "/rest/v1/", {
      headers: {
        apikey: key,
        Authorization: "Bearer " + key
      }
    });
    const schema = await res.json();
    console.log("Tables & Views available in schema paths:");
    console.log(Object.keys(schema.paths));
  } catch (err) {
    console.error("Error fetching OpenAPI:", err);
  }
}
run();
