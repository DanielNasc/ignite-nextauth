import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

type AxiosErrorResponse = AxiosError<{
  code: string;
}>;

type failedRequest = {
  onSuccess: (token: string) => void;
  onError: (error: AxiosError) => void;
};

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue: failedRequest[] = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.defaults.headers.common[
  "Authorization"
] = `Bearer ${cookies["nextauth.token"]}`;

// interceptar resposta do backend
api.interceptors.response.use(
  (response) => response, // não faz nada se a resposta for bem sucedida
  (error: AxiosErrorResponse) => {
    if (error.response?.status == 401) {
      if (error.response.data.code == "token.expired") {
        // renovar token
        cookies = parseCookies();

        const { "nextauth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          // entra no processo de renovação de token, caso não esteja
          isRefreshing = true;

          api
            .post("/refresh", { refreshToken })
            .then((response) => {
              // se os tokens foram renovados, atualiza-os no browser e no header da requisição
              const { token } = response.data;

              setCookie(null, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
              });

              setCookie(
                null,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 7, // 1 week
                  path: "/",
                }
              );

              api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

              failedRequestsQueue.forEach((request) =>
                request.onSuccess(token)
              );
              failedRequestsQueue = [];
            })
            .catch((error) => {
              failedRequestsQueue.forEach((request) => request.onError(error));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers!["Authorization"] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onError: (error: AxiosError) => {
              reject(error);
            },
          });
        });
      } else {
        signOut();
      }
    }
  }
);
