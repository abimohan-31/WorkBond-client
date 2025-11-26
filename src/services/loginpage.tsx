export async function loginUser(data: any) {
  const res = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    credentials: "include", // THIS lets cookies come through
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
