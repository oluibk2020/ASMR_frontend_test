import { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { storeContext } from "../context/storeContext";
import Spinner from "../layout/Spinner";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const {
    password,
    setPassword,
    email,
    setEmail,
    apiUrl,
    isLoading,
    setIsLoading,
    setIsAuth,
    setToken,
    setIsAdmin
  } = useContext(storeContext);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

 async function submitHandler(e) {
    e.preventDefault()

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message[0].message); // joi message
        toast.error(data.message); //api valid msg
        setIsLoading(false);
        return;
      }

      //save on local storage
      localStorage.setItem("bookApp_token", data.access_token);

      //save on context
      setToken(data.access_token);

      let decodedPayload = null;

      function isTokenExpired(token) {
        if (!token) return;

        try {
          const [, payload] = token.split(".");
          decodedPayload = JSON.parse(atob(payload));
          return decodedPayload.exp * 1000 < Date.now();
        } catch (error) {
          console.log(error);
        }
      }

      // console.log(localStorageToken);
      const tokenExpiryStatus = isTokenExpired(data.access_token);
      if (tokenExpiryStatus === false) {
        if (decodedPayload.isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAuth(false);
        setIsAdmin(false);
        localStorage.removeItem("bookApp_token");
        return
      }

      toast.success("login successful");
      //set auth globally on app
      setIsAuth(true);
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function toggle() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-center text-2xl font-bold text-primary sm:text-3xl">
            Login today
          </h1>

          <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
            Login to start make a reservation on your projects.
          </p>

          <form
            onSubmit={submitHandler}
            className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
          >
            <p className="text-center text-lg font-medium">
              Create an account with us today
            </p>

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />

                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gold-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />

                <span
                  className="absolute inset-y-0 end-0 grid place-content-center px-4"
                  onClick={toggle}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="block w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link className="underline" to="/register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
export default Login;
