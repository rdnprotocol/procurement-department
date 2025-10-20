require("dotenv").config();

(async function test() {
  console.log("🔍 Testing Supabase connection...");

  const { createClient } = require("@supabase/supabase-js");

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "❌ Missing SUPABASE_URL or key in environment. Copy .env.local.example to .env.local and fill values."
    );
    process.exit(1);
  }

  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase.rpc("version");
    if (error) {
      console.warn("⚠️ RPC `version` error (may not exist):", error.message);
    } else {
      console.log("✅ RPC version result:", data);
    }

    // Simple health check: list tables
    const { data: tables, error: tablesError } = await supabase
      .from("pg_catalog.pg_tables")
      .select("tablename")
      .limit(5);

    if (tablesError) {
      console.warn(
        "⚠️ Could not query pg_tables (permissions). You can still be connected."
      );
    } else {
      console.log("📊 Sample tables:", tables);
    }

    console.log("✅ Supabase client created successfully");
  } catch (err) {
    console.error("❌ Supabase connection/test failed:", err.message || err);
    process.exit(1);
  }
})();
