const { parse, serialize, parseSetCookie } = require("../dist/index");

// Demo: parse request cookie header
const cookieHeader = "sessionId=abc123; theme=dark; userId=42";
const parsed = parse(cookieHeader);
console.log("Parsed cookies:");
parsed.forEach((value, name) => {
  console.log(`  ${name}: ${value}`);
});

// Demo: serialize with attributes
const cookie = serialize("sessionId", "xyz789", {
  maxAge: 3600,
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
});
console.log("\nSerialized with attributes:");
console.log(cookie);

// Demo: round-trip
const reparsed = parseSetCookie(cookie);
console.log("\nRe-parsed Set-Cookie:");
console.log(`  Name: ${reparsed.name}`);
console.log(`  Value: ${reparsed.value}`);
console.log(`  Attributes:`, reparsed.attributes);

// Demo: SameSite=None requires Secure (validation)
try {
  serialize("token", "value123", {
    sameSite: "None", // Missing secure!
  });
  console.log("\nError: SameSite=None without Secure should fail!");
} catch (e) {
  console.log("\n✓ SameSite=None validation works:", e.message);
}

// Demo: Case-insensitive attribute parsing
const setCookieHeader =
  "token=abc; HTTPONLY; HttpOnly; Secure; SAMESITE=Lax";
const parsed2 = parseSetCookie(setCookieHeader);
console.log("\nCase-insensitive parsing:");
console.log(`  httpOnly: ${parsed2.attributes.httpOnly}`);
console.log(`  secure: ${parsed2.attributes.secure}`);
console.log(`  sameSite: ${parsed2.attributes.sameSite}`);
