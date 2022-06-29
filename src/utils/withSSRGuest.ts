import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

export function withSSRGuest<P>(
  fn: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async function (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> {
    const cookies = parseCookies(ctx);

    // redireciona para a página de dashboard se o usuário estiver autenticado
    if (cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
