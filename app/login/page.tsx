import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { AuthForm } from "@/components/auth/auth-form";
import LiquidEther from "@/components/liquid-ether";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  const resolvedSearchParams = await searchParams;
  const redirectTo =
    typeof resolvedSearchParams.redirectTo === "string"
      ? resolvedSearchParams.redirectTo
      : "/dashboard";

  return (
    <main className={styles.page}>
      <div aria-hidden="true" className={styles.etherLayer}>
        <LiquidEther
          autoDemo
          autoIntensity={2.8}
          autoSpeed={0.48}
          captureAllPointer
          colors={["#090506", "#4d0f21", "#b81d38"]}
          cursorSize={150}
          isBounce={false}
          isViscous
          iterationsPoisson={26}
          iterationsViscous={24}
          mouseForce={24}
          pauseOnHover={false}
          resolution={0.45}
          viscous={28}
        />
      </div>
      <div aria-hidden="true" className={styles.etherVeil} />

      <section className={styles.shell}>
        <div className={styles.copyColumn}>
          <Link className={styles.brand} href="/">
            <BrandMark />
            <span>
              Aris<span>Hub</span>
            </span>
          </Link>

          <span className={styles.eyebrow}>Login SaaS</span>
          <h1>Entre na ArisHub e assuma o centro da operacao.</h1>
          <p>
            A partir daqui o lead vira operador: dashboard privada, controle de
            BCs, advertisers, pixel hub, creative mask, cloaker proprio e toda
            a camada de launch preparada para escalar com ordem.
          </p>

          <div className={styles.signalGrid}>
            <article>
              <strong>Multi-BC real</strong>
              <span>Operacao isolada por estrutura e advertiser.</span>
            </article>
            <article>
              <strong>Creative Mask</strong>
              <span>Biblioteca, variacao e organizacao de criativos.</span>
            </article>
            <article>
              <strong>Bulk Launch</strong>
              <span>Mesma logica disparada em varias contas com rastreio.</span>
            </article>
          </div>
        </div>

        <div className={styles.formColumn}>
          {supabase ? (
            <AuthForm redirectTo={redirectTo} />
          ) : (
            <div className={styles.configCard}>
              <strong>Configure o Supabase para liberar o login.</strong>
              <p>
                Preencha `NEXT_PUBLIC_SUPABASE_URL` e
                `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas envs da Vercel para ativar a
                autenticacao do SaaS.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
