"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import PasswordRecovery from "../Components/RecoverPasswordComponent";

function ResetPasswordComponent() {
  const p = useSearchParams();
  const token = p.get("token");
  const email = p.get("email");
  return (
    <div>
      <PasswordRecovery token={token ? token : ""} email={email ? email : ""} />
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordComponent />
    </Suspense>
  );
}
