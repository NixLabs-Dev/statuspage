const IDENTITY_URL = "https://api.nixlabs.dev/identity";

export default async function handleAuth(
  secret: string,
  name: string,
  permissions: string,
) {
  // Skip auth check if developing
  if (process.env.NODE_ENV === "development") return true;

  try {
    const res = await fetch(IDENTITY_URL + "/testApp", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
        Authorization: process.env.AUTH_STRING || "",
      },
      body: JSON.stringify({
        secret,
        name,
        permissions,
      }),
    });

    const body = await res.json();

    if (body.data.success == true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}
