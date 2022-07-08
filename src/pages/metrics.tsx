import { destroyCookie } from "nookies";
import { setupAPI } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";
import decode from "jwt-decode";

export default function Metrics() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPI(ctx);

    const response = await apiClient.get("/me");

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list"],
    roles: ["administrator"],
  }
);
