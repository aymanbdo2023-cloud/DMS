import "dotenv";

// This stores the credentials of the user that has logged in
export interface UserSessionCred {
  id: number;
  username: string;
  passw: string;
}

const baseUrl = "http://localhost:3000/auth";

export const authUser = async (username: string, password: string) => {
  const url = new URL(baseUrl);
  url.searchParams.set("username", username);
  url.searchParams.set("passw", password);

  const res = await fetch(url.toString(), {
    headers: { "api-key": import.meta.env.API_KEY },
  });
  if (!res.ok) throw new Error(`Login Failed`);
  const rawData = await res.json();
  const data: UserSessionCred = rawData.result[0];
  return data;
};

export const registerUser = async (username: string, password: string) => {
  const url = new URL("http://localhost:3000/auth/registerUser");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": import.meta.env.API_KEY,
    },
    body: JSON.stringify({ username: username, password: password }),
  });

  let data = await res.json();
  let status = res.status;

  console.log("Status code: ", status);
  return { status: res.status, data };
};
