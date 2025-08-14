export async function sendChat(persona, message) {
  const res = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ persona, message }),
  });
  return res.json();
}
