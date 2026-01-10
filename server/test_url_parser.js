const url = 'postgresql://postgres.rkkjgoccadjibybulrse:Pajju@258020258@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

console.log("Testing Raw URL:", url);

try {
    const parsed = new URL(url);
    console.log("✅ new URL() Parsed Successfully:");
    console.log("Hostname:", parsed.hostname);
    console.log("Password:", parsed.password);
} catch (e) {
    console.log("❌ new URL() Failed:", e.message);
}

console.log("\nTesting Manual LastIndexOf Logic:");
const lastAt = url.lastIndexOf('@');
const rightPart = url.substring(lastAt + 1);
const hostPart = rightPart.split(':')[0].split('/')[0];
console.log("Extracted Host:", hostPart);

if (hostPart === 'aws-0-ap-south-1.pooler.supabase.com') {
    console.log("✅ Manual Logic Works!");
} else {
    console.log("❌ Manual Logic Failed.");
}
