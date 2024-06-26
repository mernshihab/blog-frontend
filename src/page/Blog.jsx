import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams,Link } from "react-router-dom";
import { socket } from "../socket/socket";
import { userLoginInfo } from "../slice/counterSlice";
import { FaFacebook, FaInstagram,FaGithub ,FaLinkedin  } from "react-icons/fa6";

const Blog = () => {
  let [like, setLike] = useState(false);
  let [blogInfo, setBlogInfo] = useState();
  let [allComment, setAllComment] = useState([]);
  let { id } = useParams();
  let dispatch = useDispatch();

  let data = useSelector((e) => e.user.userInfo);
  let navigate = useNavigate();

  useEffect(() => {
    if (data === "logout") {
      navigate("/");
    }
  }, [data]);

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:1010/api/v1/frontend/blog/singleblogs/${id}`,
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {

          setAllComment(response.data.data.commentId);

          setBlogInfo(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleLike = (blogId) => {
    socket.emit("blogLike", {
      blogId,
      authId: data.userId,
    });

    socket.on("likeBlog", (blogInfo) => {
      if (blogInfo) {
        // console.log("blogInfo", blogInfo);
        // console.log("blogInfo", blogInfo.like.includes(data.authId));


        setBlogInfo(blogInfo)

                setLike(!like);
        // if (blogInfo.like.includes(data.authId)) {
        //   console.log("ok");
  
        // } else {
        //   setLike(false);
        //   console.log("err");
        // }

        
      }
    });
  };

  let [comment, setComment] = useState("");

  let handleLogout = () => {
    dispatch(userLoginInfo(null));
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  

  const handleComment = () => { 
    console.log("comment", comment, blogInfo?._id);

    socket.emit("addComment", {
      comment, 
      authId: data.userId,
      id: blogInfo?._id
    })

    socket.on("commentAdd", (data) => {
      console.log(data);
      if (data) {
        setComment("");
        setAllComment(data)
      }
    });


   }


  return (
    <div>
      <nav className="py-4 bg-slate-900">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4">
          <div className="logo">
            <a className="font-sans text-2xl font-semibold text-white" href="/">
              Bloogish
            </a>
          </div>
          <div className="menu">
            <ul className="flex items-center gap-6 md:gap-10">
              <li>
                <Link
                  to={"/dashboard"}
                  className="font-sans text-base font-semibold text-white/80"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://portfolio-shihab.vercel.app/"
                  target="blank"
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
        </div>
      </nav>
          <section className="bg-white ">
            <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
              <div className="max-w-screen-sm mx-auto mb-8 text-center lg:mb-16">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl ">
                  Latest Blog
                </h2>
                <p className="font-light text-gray-500 sm:text-xl">
                  We use an agile approach to test assumptions and connect with
                  the needs of your audience early and often.
                </p>
              </div>
              <div className="grid gap-8 ">
                <article className="p-6 bg-white border border-gray-200 rounded-lg shadow-md ">
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
                      className="h-[600px] w-full object-cover"
                      src={`http://localhost:1010/api/v1/images/${blogInfo?.image}`}
                      alt=""
                    />
                  </div>

                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                    <a href="#">{blogInfo?.title}</a>
                  </h2>
                  <p className="mb-5 font-light text-gray-500 ">
                    {blogInfo?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      {like ? (
                        <AiFillLike
                          className="text-2xl cursor-pointer"
                          onClick={() => handleLike(blogInfo?._id)}
                        />
                      ) : (
                        <AiOutlineLike
                          className="text-2xl cursor-pointer"
                          onClick={() => handleLike(blogInfo?._id)}
                        />
                      )}
                      {blogInfo?.like.length}
                    </div>
                    <div>
                      <form>
                        <label htmlFor="chat" className="sr-only">
                          Your message
                        </label>
                        <div className="flex items-center ">
                          <textarea
                            id="chat"
                            rows="1"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="block mx-4 p-2.5 w-[350px] text-sm text-gray-900 outline-none bg-white rounded-lg border border-gray-300    "
                            placeholder="Your Comment..."
                          ></textarea>
                          <button
                            type="button"
                            onClick={handleComment}
                            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 "
                          >
                            <svg
                              className="w-5 h-5 rotate-90 rtl:-rotate-90"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 20"
                            >
                              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                            </svg>
                            <span className="sr-only">Send message</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </article>



                <div className="px-6 border border-slate-300 py-7 rounded-xl">

{allComment.length != 0 && allComment.map((el, index) => (
         <article key={index}>
         <div className="flex items-center mb-4">
           <img
             className="w-10 h-10 rounded-full me-4"
             src={`http://localhost:1010/api/v1/images/${el.authId.image}`}
             
             alt=""
           />
           <div className="font-medium ">
             <p>
               {el.authId.uname}
               <time className="block text-sm text-gray-500 dark:text-gray-400">
                 Active
               </time>
             </p>
           </div>
         </div>

         <p className="mb-2 text-gray-500 ">
          {el.descripition}
         </p>
       </article>
))}
         



                </div>
              </div>
            </div>
      </section>
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
              <div>
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
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-gray-500 sm:text-center">
              © 2024{" "}
              <a href="#" className="hover:underline">
                Bloogish
              </a>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
              <a target="blank" href="https://www.facebook.com/webshihab/" className="text-gray-400 hover:text-gray-900">
                <FaFacebook/>
                <span className="sr-only">Facebook Account</span>
              </a>
              <a target="blank" href="https://www.instagram.com/webshihab/" className="text-gray-400 hover:text-gray-900">
                <FaInstagram/>
                <span className="sr-only">Instagram Account</span>
              </a>
              <a target="blank" href="https://github.com/mernshihab" className="text-gray-400 hover:text-gray-900">
                <FaGithub/>
                <span className="sr-only">GitHub account</span>
              </a>
              <a target="blank" href="https://www.linkedin.com/in/mernshihab/" className="text-gray-400 hover:text-gray-900">
                <FaLinkedin/>
                <span className="sr-only">Linkedin account</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
