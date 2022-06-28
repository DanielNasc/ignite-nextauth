import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from "../services/api";

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
