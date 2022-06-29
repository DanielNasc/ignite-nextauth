import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async function (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> {
    const cookies = parseCookies(ctx);

    // redireciona para a página de login se o usuário não estiver autenticado
    if (!cookies["nextauth.token"]) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
