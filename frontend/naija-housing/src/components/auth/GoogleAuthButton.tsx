// "use client";

// import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
// import { useRouter, useSearchParams } from "next/navigation";
// import { AxiosError } from "axios";
// import { useState } from "react";
// import api from "@/libs/api";
// import { useAuth } from "@/context/AuthContext";

// type Props = {
//   mode?: "login" | "register";
// };

// export default function GoogleAuthButton({ mode = "login" }: Props) {
//   const { login } = useAuth();
//   const router = useRouter();
//   const params = useSearchParams();
//   const [error, setError] = useState("");

//   const handleSuccess = async (credentialResponse: CredentialResponse) => {
//     try {
//       setError("");

//       if (!credentialResponse.credential) {
//         setError("Google authentication failed");
//         return;
//       }

//       const res = await api.post("/auth/google", {
//         credential: credentialResponse.credential,
//       });

//       login(res.data.user, res.data.token);

//       const redirectUrl = params.get("redirect");
//       router.push(redirectUrl || "/");
//     } catch (err: unknown) {
//       if (err instanceof AxiosError) {
//         setError(err.response?.data?.message || "Google sign-in failed");
//       } else {
//         setError("Google sign-in failed");
//       }
//     }
//   };

//   return (
//     <div className="space-y-3">
//       <GoogleLogin
//         onSuccess={handleSuccess}
//         onError={() => setError("Google sign-in failed")}
//         text={mode === "login" ? "signin_with" : "signup_with"}
//         shape="rectangular"
//         theme="outline"
//         size="large"
//         width="100%"
//       />

//       {error && <p className="text-sm text-red-500">{error}</p>}
//     </div>
//   );
// }



"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { useState } from "react";
import api from "@/libs/api";
import { useAuth } from "@/context/AuthContext";

type Props = {
  mode?: "login" | "register";
};

export default function GoogleAuthButton({ mode = "login" }: Props) {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setError("");

      if (!credentialResponse.credential) {
        setError("Google authentication failed");
        return;
      }

      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      login(res.data.user);

      const redirectUrl = params.get("redirect");
      router.push(redirectUrl || "/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Google sign-in failed");
      } else {
        setError("Google sign-in failed");
      }
    }
  };

  return (
    <div className="space-y-3">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setError("Google sign-in failed")}
        text={mode === "login" ? "signin_with" : "signup_with"}
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}