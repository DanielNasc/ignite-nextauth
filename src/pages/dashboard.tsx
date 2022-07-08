import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPI } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);

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

      <button onClick={signOut}>Sign Out</button>

      {/* <Can permissions={["metrics.list"]}>
        <h2>Metrics</h2>
      </Can> */}
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPI(ctx);
  const response = await apiClient.get("/me");

  return {
    props: {},
  };
});
