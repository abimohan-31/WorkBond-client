// services/ProviderSignUp.ts
export async function SignUpProvider(data: any) {
  try {
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        role: "provider",
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("SignUpProvider error:", error);
    throw error;
  }
}
