import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPI } from "../services/api";
import { api } from "../services/apiClient";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("/me")
      .then((response) => {
        console.log("Dashboard response", response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Hello, {user.email}</h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPI(ctx);

  try {
    const response = await apiClient.get("/me");

    console.log("API Client Response", response.data);
  } catch (err) {
    destroyCookie(ctx, "nextauth.token");
    destroyCookie(ctx, "nextauth.refreshToken");

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
