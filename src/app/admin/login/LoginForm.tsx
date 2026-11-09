"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-8" noValidate>
      <div>
        <label htmlFor="email" className="label !text-white">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="field !border-white/30 !text-white placeholder:!text-white/30"
          placeholder="voce@newway.com.br"
        />
      </div>
      <div>
        <label htmlFor="password" className="label !text-white">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field !border-white/30 !text-white placeholder:!text-white/30"
          placeholder="••••••••"
        />
      </div>
      {state.error && (
        <p role="alert" className="border-l-4 border-brand bg-white/5 px-4 py-3 text-sm text-white">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
