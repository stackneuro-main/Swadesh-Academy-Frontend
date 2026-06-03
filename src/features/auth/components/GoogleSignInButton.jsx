import { useEffect, useRef, useState } from "react";

import FeedbackMessage from "../../../components/ui/FeedbackMessage";
import { useAuth } from "../useAuth";

let googleScriptPromise = null;

function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Sign-In is only available in the browser."));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-google-identity="true"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.google));
        existingScript.addEventListener("error", () => {
          reject(new Error("Unable to load Google Sign-In."));
        });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Unable to load Google Sign-In."));
      document.body.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export default function GoogleSignInButton() {
  const buttonRef = useRef(null);
  const [renderError, setRenderError] = useState("");
  const { authError, isSigningIn, signInWithGoogleToken } = useAuth();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setRenderError("Missing VITE_GOOGLE_CLIENT_ID in the frontend environment.");
      return;
    }

    let isMounted = true;

    loadGoogleScript()
      .then((google) => {
        if (!isMounted || !buttonRef.current) {
          return;
        }

        buttonRef.current.innerHTML = "";
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response.credential) {
              setRenderError("Google Sign-In did not return a credential.");
              return;
            }

            try {
              await signInWithGoogleToken(response.credential);
            } catch {
              // The mutation error is shown through authError.
            }
          },
        });

        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 280,
        });
      })
      .catch((error) => {
        if (isMounted) {
          setRenderError(error.message || "Unable to load Google Sign-In.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [signInWithGoogleToken]);

  return (
    <div className="space-y-3">
      <div ref={buttonRef} className={isSigningIn ? "pointer-events-none opacity-70" : ""} />
      <FeedbackMessage type="error" message={renderError || authError} />
    </div>
  );
}
