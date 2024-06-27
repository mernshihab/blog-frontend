import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoginInfo } from "../slice/counterSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  let navigate = useNavigate();
  let data = useSelector((e) => e.user.userInfo);

  useEffect(() => {
    if (data != "logout") {
      if (data.login) {
        navigate("/home");
      }
    }
  }, [data]);

  const handleLogin = () => {
    if (!email) {
      toast.error("Enter your email");
    } else if (!password) {
      toast.error("Enter your password");
    } else {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://blog-backend-ai0z.onrender.com/api/v1/backend/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email,
          password,
        },
      };

      axios
        .request(config)
        .then((response) => {
          if (response.data.success === "ok") {
            toast.success("Login Success");
            setTimeout(() => {
              dispatch(userLoginInfo(response.data.data));
              localStorage.setItem(
                "userInfo",
                JSON.stringify(response.data.data)
              );
              setEmail("");
              setPassword("");
            }, 1000);
          } else if (response.data.error === "info wrong email") {
            toast.error("Email not found");
          } else if (response.data.error === "info wrong password") {
            toast.error("Wrong Password");
            return;
          } else if (response.data.error === "info wrong email false") {
            toast.warning("Please verify your email");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className='bg-[url("/bg.svg")] bg-cover bg-center h-screen flex items-center px-3'>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <div className="h-[90%] w-full max-w-[1320px] mx-auto flex flex-col md:flex-row justify-center bg-white bg-opacity-5 rounded-xl shadow-md backdrop-blur-md overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full w-full md:w-1/2 md:items-start md:pl-16 lg:pl-40 p-6 md:p-0">
          <h1 className="mb-3 text-xl font-bold text-white lg:text-3xl">
            Login to your account!
          </h1>
          <div className="flex flex-col w-full">
            <fieldset className="px-2 pb-2 mb-5 rounded-md border border-white/75">
              <legend className="px-2 text-xs text-white/70">
                Email Address
              </legend>
              <input
                className="w-full px-2 text-white bg-transparent border-0 outline-none ring-0"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Youraddress@email.com"
              />
            </fieldset>
            <fieldset className="px-2 pb-2 rounded-md border border-white/75">
              <legend className="px-2 text-xs text-white/70">Password</legend>
              <input
                className="w-full px-2 text-white bg-transparent border-0 outline-none ring-0"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </fieldset>
            <button
              className="w-full py-2 mt-5 text-center transition-all duration-200 bg-blue-300 rounded cursor-pointer hover:bg-blue-600 hover:text-white mb-7"
              onClick={handleLogin}
            >
              Login to Continue
            </button>
          </div>
          <p className="text-base text-white/70">
            Don’t have an account?{" "}
            <span className="text-red-500 cursor-pointer">
              <Link to="/registration">Sign up</Link>
            </span>
          </p>
        </div>
        <div className="hidden md:block md:w-1/2 bg-[url('/rgbg.png')] bg-auto md:bg-contain bg-no-repeat bg-left h-full"></div>
      </div>
    </div>
  );
};

export default Login;
