"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const initialState = {
  error: ""
};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="admin-card admin-form" action={formAction}>
      <div>
        <label htmlFor="password">Passord</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Skriv inn redaksjonspassord"
          required
        />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <button type="submit" className="primary-button" disabled={pending}>
        {pending ? "Logger inn..." : "Logg inn"}
      </button>
    </form>
  );
}
