import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLoginInfo } from "../slice/counterSlice";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

const Home = () => {
  let data = useSelector((e) => e.user.userInfo);
  let [allBlog, setAllBlog] = useState([]);

  let navigate = useNavigate();
  let dispatch = useDispatch();

  let handleLogout = () => {
    dispatch(userLoginInfo(null));
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (data === "logout") {
      navigate("/");
    }
  }, [data]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://blog-backend-ai0z.onrender.com/api/v1/frontend/blog/all",
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setAllBlog(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // console.log("allBlog", allBlog);

  return (
    <>
      {/* navbar */}
      <nav className="py-4 bg-slate-900">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4">
          <div className="logo">
            <a className="font-sans text-2xl font-semibold text-white" href="#">
              Bloogish
            </a>
          </div>
          <div className="hidden md:flex items-center gap-6 md:gap-10">
            <ul className="flex items-center gap-6 md:gap-10">
              <li>
                <Link
                  to="/dashboard"
                  className="font-sans text-base font-semibold text-white/80"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://portfolio-shihab.vercel.app/"
                  target="_blank"
                  className="font-sans text-base font-semibold text-white/80"
                >
                  Shihab Portfolio
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="font-sans text-base font-semibold text-white py-2 px-5 bg-red-600 rounded-md"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white text-xl">
              <IoMenu />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed inset-y-0 right-0 w-1/2 max-w-sm bg-slate-800 p-4 overflow-y-auto transition-transform transform translate-x-0 z-50">
              <button onClick={toggleMenu} className="text-white mb-4">
                Close
              </button>
              <ul className="flex flex-col items-start gap-4">
                <li>
                  <Link
                    to="/dashboard"
                    className="font-sans text-base font-semibold text-white/80"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a
                    href="https://portfolio-shihab.vercel.app/"
                    target="_blank"
                    className="font-sans text-base font-semibold text-white/80"
                    onClick={toggleMenu}
                  >
                    Shihab Portfolio
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="font-sans text-base font-semibold text-white py-2 px-5 bg-red-600 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>

      {/* content */}
      <div>
        <section className="bg-white">
          <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
            <div className="max-w-screen-sm mx-auto mb-8 text-center lg:mb-16">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl">
                Latest Blog
              </h2>
              <p className="font-light text-gray-500 sm:text-xl">
              Stay updated with our newest posts and stories.
              </p>
            </div>
            <div className="flex justify-end ">
              <Link
                to={"/dashboard"}
                className="font-semibold text-sm md:text-base bg-slate-900 text-white py-2 px-5 rounded-md my-5"
              >
                Post a Blog
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allBlog.length !== 0 &&
                allBlog.map((el, index) => (
                  <article
                    key={index}
                    className="p-6 bg-white border border-gray-200 rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-between mb-5 text-gray-500">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                        </svg>
                        Tutorial
                      </span>
                      <span className="text-sm cursor-pointer">
                        View all comment
                      </span>
                    </div>
                    <div className="p-4 my-4 border">
                      <img
                        className="object-cover w-full h-60"
                        src={`https://blog-backend-ai0z.onrender.com/api/v1/images/${el.image}`}
                        alt=""
                      />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      <a href="#">{el.title}</a>
                    </h2>
                    <p className="mb-5 font-light text-gray-500">
                      {el.description.substr(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          className="rounded-full w-7 h-7"
                          src={`https://blog-backend-ai0z.onrender.com/api/v1/images/${el.authId.image}`}
                          alt="Author avatar"
                        />
                        <span className="font-medium">{el.authId.uname}</span>
                      </div>
                      <Link
                        to={`/blog/${el._id}`}
                        className="inline-flex items-center font-medium text-primary-600 hover:underline"
                      >
                        Read more
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </section>
      </div>

      {/* footer */}
      <footer className="bg-white">
        <div className="w-full max-w-screen-xl p-4 py-6 mx-auto lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <a href="#" className="flex items-center">
                <span className="self-center text-2xl font-semibold whitespace-nowrap">
                  Bloogish
                </span>
              </a>
              <p className="mt-2 text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laboriosam voluptatum voluptatibus vero facilis minima quidem.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                  Resources
                </h2>
                <ul className="font-medium text-gray-500">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      CITI
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Tailwind CSS
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                  Resources
                </h2>
                <ul className="font-medium text-gray-500">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      CITI
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Tailwind CSS
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="font-sans text-base font-semibold text-white py-2 px-5 bg-red-600 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="flex flex-col sm:flex-row items-center sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center">
              © 2024{" "}
              <a href="#" className="hover:underline">
                Bloogish
              </a>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
              <a
                target="_blank"
                href="https://www.facebook.com/webshihab/"
                className="text-gray-400 hover:text-gray-900"
              >
                <FaFacebook />
                <span className="sr-only">Facebook Account</span>
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/webshihab/"
                className="text-gray-400 hover:text-gray-900"
              >
                <FaInstagram />
                <span className="sr-only">Instagram Account</span>
              </a>
              <a
                target="_blank"
                href="https://github.com/mernshihab"
                className="text-gray-400 hover:text-gray-900"
              >
                <FaGithub />
                <span className="sr-only">GitHub Account</span>
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/mernshihab/"
                className="text-gray-400 hover:text-gray-900"
              >
                <FaLinkedin />
                <span className="sr-only">Linkedin Account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
