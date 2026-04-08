"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getBrowserSupabase,
  hasBrowserSupabaseConfig,
} from "@/lib/supabase/client";
import styles from "./auth-form.module.css";

type Mode = "login" | "signup";

interface AuthFormProps {
  redirectTo: string;
}

export function AuthForm({ redirectTo }: AuthFormProps) {
  const router = useRouter();
  const isConfigured = hasBrowserSupabaseConfig();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      if (!isConfigured) {
        throw new Error(
          "Supabase publico nao configurado no frontend. Confira NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel e gere um novo deploy.",
        );
      }

      const supabase = getBrowserSupabase();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        router.replace(redirectTo || "/dashboard");
        router.refresh();
        return;
      }

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || window.location.origin || "";

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appUrl}/dashboard`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setMessage(
        "Conta criada. Se o seu projeto exigir confirmacao de email, verifique a caixa de entrada antes de entrar.",
      );
      setMode("login");
    } catch (caughtError) {
      const resolvedError =
        caughtError instanceof Error
          ? caughtError.message
          : "Nao foi possivel autenticar agora.";
      setError(resolvedError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.modeSwitch}>
        <button
          type="button"
          className={mode === "login" ? styles.modeActive : ""}
          onClick={() => setMode("login")}
        >
          Entrar
        </button>
        <button
          type="button"
          className={mode === "signup" ? styles.modeActive : ""}
          onClick={() => setMode("signup")}
        >
          Criar conta
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Email</span>
          <input name="email" type="email" placeholder="voce@arishub.com" required />
        </label>

        <label className={styles.field}>
          <span>Senha</span>
          <input
            name="password"
            type="password"
            placeholder="Sua senha segura"
            minLength={6}
            required
          />
        </label>

        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.message}>{message}</p> : null}
        {!isConfigured ? (
          <p className={styles.error}>
            As envs publicas do Supabase nao chegaram no frontend.
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={loading || !isConfigured}>
          {loading
            ? "Processando..."
            : mode === "login"
              ? "Entrar na dashboard"
              : "Criar acesso"}
        </button>
      </form>
    </div>
  );
}
