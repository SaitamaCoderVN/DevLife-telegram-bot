import { magic } from "../lib/magic";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FakeHome from "../components/FakeHome";
import { AuthContextData, useAuth } from "../contexts/AuthProvider";
import Loading from "../components/ui/Loading";

const Login = () => {
  const navigate = useNavigate();
  const [loadingOauth, setLoadingOauth] = useState(false); // State cho loading trước khi xử lý OAuth
  const [loadingRedirect, setLoadingRedirect] = useState(false); // State cho loading sau khi đăng nhập thành công
  const { setRedirectResult } = useAuth() as AuthContextData;

  const handleSocialLogin = async () => {
    try {
      setLoadingOauth(true); // Bắt đầu loading trước khi xử lý OAuth
      // @ts-expect-error - later
      await magic.oauth.loginWithRedirect({
        provider: "google",
        redirectURI: new URL("/auth/callback", window.location.origin).href,
      });
    } catch (err) {
      console.error(err);
      setLoadingOauth(false); // Kết thúc loading nếu có lỗi
    }
  };

  useEffect(() => {
    const checkPathAndNavigate = async () => {
      if (window.location.pathname === "/auth/callback") {
        setLoadingRedirect(true); // Bắt đầu loading sau khi đăng nhập thành công
        try {
          // @ts-expect-error - later
          const redirectResult = await magic.oauth.getRedirectResult();
          setRedirectResult(redirectResult);
          localStorage.setItem(
            "redirectResult",
            JSON.stringify(redirectResult)
          );
          console.log(redirectResult);
          navigate("/home");
        } catch (err) {
          console.error("Error getting redirect result:", err);
        } finally {
          setLoadingRedirect(false); // Kết thúc loading sau khi xử lý redirect
        }
      }
    };
    checkPathAndNavigate();
  }, [navigate]);

  if (loadingOauth) {
    return <Loading />;
  }

  if (loadingRedirect) {
    return <FakeHome />;
  }

 
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-50">
      <div className="flex flex-col items-center mb-20">
        <img
          src="/assets/UI/console_1.png"
          alt="Devlife Game"
          className="mb-4 rounded-lg"
          style={{ width: "300px", height: "auto" }}
        />
        <h1 style={{ fontSize: "5vw" }}>The Devlife Game</h1>
        <button className="mt-5" onClick={handleSocialLogin}>
          <div className="flex flex-row items-center">
          <style>
              {`
                @keyframes blink {
                  0% { opacity: 1; color: red; }
                  12.5% { opacity: 0.85; color: orange; }
                  25% { opacity: 0.75; color: yellow; }
                  37.5% { opacity: 0.65; color: green; }
                  50% { opacity: 0.5; color: blue; }
                  62.5% { opacity: 0.75; color: indigo; }
                  75% { opacity: 0.85; color: violet; }
                  87.5% { opacity: 0.9; color: black; }
                  100% { opacity: 1; color: red; }
                }
                .blinking {
                  animation: blink 1s infinite;
                }
              `}
            </style>
            <FcGoogle size={"2.5rem"} />
            <span className="font-bold ml-2 blinking ">Log in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Login;
