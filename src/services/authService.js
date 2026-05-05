export const loginAdmin = async (email, password) => {
  const res = await fetch(
    "http://localhost:3002/admin/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputdata: {
          email,
          password,
          firebase_token: ""
        }
      })
    }
  );

  const data = await res.json();

  if (data.status === "error") {
    throw new Error(data.msg || "Login failed");
  }

  localStorage.setItem("token", data.data.token);
  localStorage.setItem("admin", JSON.stringify(data.data.admin));

  return data.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  window.location.href = "/auth/sign-in";
};
