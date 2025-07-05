import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {} = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      console.log("AuthCallback: Processing OAuth callback");
      console.log("URL search params:", window.location.search);

      const token = searchParams.get("token");
      const error = searchParams.get("error");

      console.log("Token from URL:", token);
      console.log("Error from URL:", error);

      if (error) {
        console.error("OAuth error:", error);
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (token) {
        try {
          // Store the token and get user info
          localStorage.setItem("token", token);

          // Fetch user info to update auth state
          const API_BASE_URL =
            import.meta.env.VITE_API_URL || "http://localhost:8080";
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (data.success) {
            setStatus("success");
            setMessage("Successfully logged in with Google!");

            // Trigger a page reload to update auth context
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          } else {
            throw new Error("Failed to get user info");
          }
        } catch (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage("Authentication failed. Please try again.");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/"), 3000);
        }
      } else {
        setStatus("error");
        setMessage("No authentication token received.");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 w-full max-w-md border border-gray-700/50 shadow-2xl shadow-black/20">
        <div className="text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-yellow-400 animate-spin" />
              <h2 className="text-2xl font-bold font-display text-white mb-2">
                Completing Authentication
              </h2>
              <p className="text-gray-400">
                Please wait while we log you in...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h2 className="text-2xl font-bold font-display text-white mb-2">
                Success!
              </h2>
              <p className="text-gray-400">{message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to home page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold font-display text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-400">{message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to home page...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
