import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { userLoginInfo } from "../slice/counterSlice";

const Dash = () => {
  let data = useSelector((e) => e.user.userInfo);
  let navigate = useNavigate();
  let dispatch = useDispatch();

  let [show, setShow] = useState(true);
  let [realTime, setRealTime] = useState(false);
  let [editBlog, setEditBlog] = useState();
  let [titleTwo, setTitleTwo] = useState("");
  let [allBlog, setAllBlog] = useState([]);
  let [imageTwo, setImageTwo] = useState("");
  let [image, setImage] = useState("");
  let [title, setTitle] = useState("");
  let [desc, setDesc] = useState("");
  let [descTwo, setDescTwo] = useState("");
  const [activeButton, setActiveButton] = useState("output");
  let [showPage, setShowPage] = useState({
    add: false,
    table: true,
    edit: false,
  });

  const handlePost = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://blog-backend-ai0z.onrender.com/api/v1/backend/blog/create",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        title,
        description: desc,
        image_post: image,
        authId: data.userId,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if ("success" in response.data) {
          setTitle("");
          setImage("");
          setDesc("");
          setShowPage({
            add: false,
            table: true,
            edit: false,
          });
          setRealTime(!realTime);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    socket.emit("blogDelete", id);
    socket.on("deleteBlog", (blogData) => {
      if (blogData._id) {
        setAllBlog((allData) => {
          let arr = [...allData];

          let updateData = arr.filter((el) => el._id != blogData._id);

          return updateData;
        });
      }
    });
  };

  // edit blog code
  const handleEditBlog = (id) => {
    socket.emit("blogEdit", id);
    socket.on("editBlog", (blogData) => {
      if (blogData._id) {
        setEditBlog(blogData);
      }
    });
  };

  const handlePostUpdate = (id) => {
    // console.log(imageTwo, id, descTwo, titleTwo);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://blog-backend-ai0z.onrender.com/api/v1/backend/blog/update",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        titleTwo,
        descTwo,
        photo_upload: imageTwo,
        blogId: id,
        image_name: editBlog?.image,
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data.data);

        if ("success" in response.data) {
          setTitleTwo("");
          setImageTwo("");
          setDescTwo("");

          setShowPage({
            add: false,
            table: true,
            edit: false,
          });

          setAllBlog((prev) => {
            let arr = [...prev];

            let updateArr = arr.map((el) => {
              if (el._id == response.data.data._id) {
                return {
                  ...response.data.data,
                };
              }
              return el;
            });

            return updateArr;
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let handleLogout = () => {
    dispatch(userLoginInfo(null));
    localStorage.removeItem("userInfo");
    window.location.reload();
  };
  // edit blog code

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://blog-backend-ai0z.onrender.com/api/v1/backend/blog/all",
    };

    axios
      .request(config)
      .then((response) => {
        if ("data" in response.data) {
          let dataArray = response.data.data;
          let arr = [];
          dataArray.forEach((item) => {
            if (item.authId == data.userId) {
              arr.push(item);
            }
            setAllBlog(arr);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [realTime]);

  useEffect(() => {
    if (data === "logout") {
      navigate("/");
    }
  }, [data]);

  return (
    <div>
      {/* header */}
      <div className="absolute top-0 left-0 flex w-full h-16 pl-64 bg-white border-b">
        <div className="flex items-center flex-1 h-full px-4 text-2xl font-bold tracking-wide text-gray-800">
          Dashboard
        </div>

        <div className="flex">
          <div>
            <Link
              to="/"
              className="py-2 px-5 bg-green-500 text-white rounded-md mr-10"
            >
              Home
            </Link>
          </div>
          <div className="flex items-center justify-center w-16 text-white border-l">
            <button
              onClick={handleLogout}
              className="py-2 px-5 bg-red-600 mr-20 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* sidebar */}
      <div className="absolute top-5 left-0 w-64 h-screen overflow-y-scroll bg-white border-r">
        {/* logo */}
        <a
          aria-label="image"
          href="#"
          className="flex items-center justify-center w-full h-16 text-xl font-bold text-gray-800 "
        >
          <img
            alt=""
            src={`https://blog-backend-ai0z.onrender.com/api/v1/images/${data.image}`}
            className="h-28 w-28 absolute top-0 left-12 border border-white/75 rounded-full"
          />
        </a>

        {/* nav */}
        <div className="pt-4 pr-4 mt-16 border-t">
          <a
            href="#"
            className="flex items-center h-12 text-sm font-normal tracking-wide text-gray-700 rounded-r-lg hover:text-black"
          >
            <svg className="w-5 h-5 mx-3 fill-current" viewBox="0 0 512 512">
              <path d="m197.332031 170.667969h-160c-20.585937 0-37.332031-16.746094-37.332031-37.335938v-96c0-20.585937 16.746094-37.332031 37.332031-37.332031h160c20.589844 0 37.335938 16.746094 37.335938 37.332031v96c0 20.589844-16.746094 37.335938-37.335938 37.335938zm-160-138.667969c-2.941406 0-5.332031 2.390625-5.332031 5.332031v96c0 2.945313 2.390625 5.335938 5.332031 5.335938h160c2.945313 0 5.335938-2.390625 5.335938-5.335938v-96c0-2.941406-2.390625-5.332031-5.335938-5.332031zm0 0" />
              <path d="m197.332031 512h-160c-20.585937 0-37.332031-16.746094-37.332031-37.332031v-224c0-20.589844 16.746094-37.335938 37.332031-37.335938h160c20.589844 0 37.335938 16.746094 37.335938 37.335938v224c0 20.585937-16.746094 37.332031-37.335938 37.332031zm-160-266.667969c-2.941406 0-5.332031 2.390625-5.332031 5.335938v224c0 2.941406 2.390625 5.332031 5.332031 5.332031h160c2.945313 0 5.335938-2.390625 5.335938-5.332031v-224c0-2.945313-2.390625-5.335938-5.335938-5.335938zm0 0" />
              <path d="m474.667969 512h-160c-20.589844 0-37.335938-16.746094-37.335938-37.332031v-96c0-20.589844 16.746094-37.335938 37.335938-37.335938h160c20.585937 0 37.332031 16.746094 37.332031 37.335938v96c0 20.585937-16.746094 37.332031-37.332031 37.332031zm-160-138.667969c-2.945313 0-5.335938 2.390625-5.335938 5.335938v96c0 2.941406 2.390625 5.332031 5.335938 5.332031h160c2.941406 0 5.332031-2.390625 5.332031-5.332031v-96c0-2.945313-2.390625-5.335938-5.332031-5.335938zm0 0" />
              <path d="m474.667969 298.667969h-160c-20.589844 0-37.335938-16.746094-37.335938-37.335938v-224c0-20.585937 16.746094-37.332031 37.335938-37.332031h160c20.585937 0 37.332031 16.746094 37.332031 37.332031v224c0 20.589844-16.746094 37.335938-37.332031 37.335938zm-160-266.667969c-2.945313 0-5.335938 2.390625-5.335938 5.332031v224c0 2.945313 2.390625 5.335938 5.335938 5.335938h160c2.941406 0 5.332031-2.390625 5.332031-5.335938v-224c0-2.941406-2.390625-5.332031-5.332031-5.332031zm0 0" />
            </svg>
            Dashboard
          </a>

          <button
            onClick={() => {
              setActiveButton("input");
              setShowPage({
                add: true,
                table: false,
                edit: false,
              });
            }}
            type="button"
            className={`flex w-full items-center tracking-wide font-normal text-sm h-12 rounded-r-lg my-2 ${
              activeButton === "input"
                ? "bg-purple-700 shadow-xl text-white"
                : "text-gray-700"
            }`}
          >
            <svg className="w-5 h-5 mx-3 fill-current" viewBox="-21 0 512 512">
              <path d="m389.332031 160c-44.09375 0-80-35.882812-80-80s35.90625-80 80-80c44.097657 0 80 35.882812 80 80s-35.902343 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0" />
              <path d="m389.332031 512c-44.09375 0-80-35.882812-80-80s35.90625-80 80-80c44.097657 0 80 35.882812 80 80s-35.902343 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0" />
              <path d="m80 336c-44.097656 0-80-35.882812-80-80s35.902344-80 80-80 80 35.882812 80 80-35.902344 80-80 80zm0-128c-26.453125 0-48 21.523438-48 48s21.546875 48 48 48 48-21.523438 48-48-21.546875-48-48-48zm0 0" />
              <path d="m135.703125 240.425781c-5.570313 0-10.988281-2.902343-13.910156-8.0625-4.375-7.679687-1.707031-17.453125 5.972656-21.824219l197.953125-112.855468c7.65625-4.414063 17.449219-1.726563 21.800781 5.976562 4.375 7.679688 1.707031 17.449219-5.972656 21.824219l-197.953125 112.851563c-2.496094 1.40625-5.203125 2.089843-7.890625 2.089843zm0 0" />
              <path d="m333.632812 416.425781c-2.6875 0-5.398437-.683593-7.894531-2.109375l-197.953125-112.855468c-7.679687-4.371094-10.34375-14.144532-5.972656-21.824219 4.351562-7.699219 14.125-10.367188 21.804688-5.972657l197.949218 112.851563c7.679688 4.375 10.347656 14.144531 5.976563 21.824219-2.945313 5.183594-8.363281 8.085937-13.910157 8.085937zm0 0" />
            </svg>
            Create Blog
          </button>

          <button
            onClick={() => {
              setActiveButton("output");
              setShowPage({
                add: false,
                table: true,
                edit: false,
              });
            }}
            type="button"
            className={`flex w-full items-center tracking-wide font-normal text-sm h-12 rounded-r-lg my-2 ${
              activeButton === "output"
                ? "bg-purple-700 shadow-xl text-white"
                : "text-gray-700"
            }`}
          >
            <svg className="w-5 h-5 mx-3 fill-current" viewBox="-43 0 512 512">
              <path d="m16 512c-8.832031 0-16-7.167969-16-16v-480c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v480c0 8.832031-7.167969 16-16 16zm0 0" />
              <path d="m240 277.332031h-224c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h224c2.945312 0 5.332031-2.386719 5.332031-5.332031v-202.667969c0-2.941406-2.386719-5.332031-5.332031-5.332031h-224c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h224c20.585938 0 37.332031 16.746094 37.332031 37.332031v202.667969c0 20.585938-16.746093 37.332031-37.332031 37.332031zm0 0" />
              <path d="m389.332031 362.667969h-213.332031c-20.585938 0-37.332031-16.746094-37.332031-37.335938v-64c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v64c0 2.902344 2.429687 5.335938 5.332031 5.335938h213.332031c2.902344 0 5.335938-2.433594 5.335938-5.335938v-202.664062c0-2.902344-2.433594-5.335938-5.335938-5.335938h-128c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h128c20.589844 0 37.335938 16.746094 37.335938 37.335938v202.664062c0 20.589844-16.746094 37.335938-37.335938 37.335938zm0 0" />
            </svg>
            All Blog
          </button>
        </div>
      </div>

      {/* body */}

      {showPage.add && (
        <div className="w-full min-h-screen pt-16 pl-64 bg-gray-100">
          <div className="p-8 text-sm text-gray-800">
            <div className="flex justify-between">
              <h1 className="mb-8 text-4xl font-bold leading-none text-gray-700">
                Create your Blog...
              </h1>
            </div>

            <table className="w-full text-left border shadow-sm">
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Image
                </th>
                <td className="border">
                  <label
                    className="block w-full h-full p-3 pb-0 outline-none cursor-pointer "
                    htmlFor="image"
                  >
                    Upload image...
                  </label>
                  <input
                    id="image"
                    name="image_post"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="block w-full h-full p-3 pt-0 outline-none cursor-pointer "
                    type="file"
                  />
                </td>
              </tr>
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Title
                </th>
                <td className="border">
                  <input
                    className="w-full h-full p-3 bg-transparent outline-none"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Blog title..."
                  />
                </td>
              </tr>
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Description
                </th>
                <td className="border">
                  <textarea
                    className="w-full h-40 p-3 bg-transparent outline-none"
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Description..."
                    cols="30"
                    rows="10"
                  >
                    {desc}
                  </textarea>
                </td>
              </tr>
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Post
                </th>
                <td className="border ">
                  <button
                    onClick={handlePost}
                    className="w-full h-full p-3 text-white bg-green-700 outline-none"
                  >
                    Post
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      )}

      {showPage.table && (
        <div className="w-full min-h-screen pt-16 pl-64 bg-gray-100">
          <div className="p-8 text-sm text-gray-800">
            <div className="flex justify-between">
              <h1 className="mb-8 text-4xl font-bold leading-none text-gray-700">
                Your blogs
              </h1>
              <div>
                <Link
                  to="/"
                  className="py-2 px-5 bg-green-500 text-white rounded-md mr-10"
                >
                  Home
                </Link>
              </div>
            </div>
            <table className="w-full text-left border shadow-sm">
              <thead>
                <tr>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    No
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Image
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Title
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Description
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Like
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Comment
                  </th>

                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    <span>Edit</span>
                  </th>
                  <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white border rounded">
                {allBlog.length != 0 &&
                  allBlog.map((el, index) => (
                    <tr key={index}>
                      <td className="p-3 border" width="50px">
                        {index + 1}
                      </td>
                      <td className="p-3 border" width="250px">
                        <img
                          alt=""
                          src={`https://blog-backend-ai0z.onrender.com/api/v1/images/${el.image}`}
                          className="h-11"
                        />
                      </td>
                      <td className="p-3 border" width="400px">
                        {el.title}
                      </td>
                      <td className="p-3 border">
                        {el.description.substr(0, 100)}...
                      </td>
                      <td className="p-3 border">5</td>
                      <td className="p-3 border">6</td>

                      <td className="border " width="100px">
                        <button
                          onClick={() => {
                            handleEditBlog(el._id);
                            setShowPage({
                              add: false,
                              table: false,
                              edit: true,
                            });
                          }}
                          className="w-full h-full p-3 rounded-md text-white bg-gray-700 outline-none"
                        >
                          Edit
                        </button>
                      </td>
                      <td className="border " width="100px">
                        <button
                          onClick={() => handleDelete(el._id)}
                          className="w-full h-full p-3 rounded-md text-white bg-red-700 outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPage.edit && (
        <div className="w-full min-h-screen pt-16 pl-64 bg-gray-100">
          <div className="p-8 text-sm text-gray-800">
            <div className="flex justify-between">
              <h1 className="mb-8 text-4xl font-bold leading-none text-gray-700">
                Edit your Blog...
              </h1>
              <Link to="/blog">See all blog</Link>
            </div>

            <table className="w-full text-left border shadow-sm">
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Image
                </th>
                <td className="border">
                  <img
                    alt=""
                    src={`https://blog-backend-ai0z.onrender.com/api/v1/images/${editBlog?.image}`}
                    className="h-11"
                  />

                  <label
                    className="block w-full h-full p-3 pb-0 outline-none cursor-pointer "
                    htmlFor="image"
                  >
                    Upload image...
                  </label>
                  <input
                    id="image"
                    className="block w-full h-full p-3 pt-0 outline-none cursor-pointer "
                    type="file"
                    name="photo_upload"
                    onChange={(e) => setImageTwo(e.target.files[0])}
                  />
                </td>
              </tr>
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Title
                </th>
                <td className="border">
                  <input
                    className="w-full h-full p-3 bg-transparent outline-none"
                    type="text"
                    onChange={(e) => setTitleTwo(e.target.value)}
                    value={titleTwo ? titleTwo : editBlog?.title}
                    placeholder="Blog title..."
                  />
                </td>
              </tr>
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Description
                </th>
                <td className="border">
                  {/* // edit blog code */}
                  <textarea
                    className="w-full h-40 p-3 bg-transparent outline-none"
                    cols="30"
                    onChange={(e) => setDescTwo(e.target.value)}
                    rows="10"
                    value={descTwo ? descTwo : editBlog?.description}
                  ></textarea>
                  {/* // edit blog code */}
                </td>
              </tr>
              <tr>
                <th className="p-3 text-xs font-bold tracking-wide text-gray-900 uppercase w-28">
                  Post
                </th>
                <td className="border ">
                  <button
                    onClick={() => {
                      setShowPage({
                        table: true,
                        add: false,
                        edit: false,
                      });

                      handlePostUpdate(editBlog?._id);
                    }}
                    className="w-full h-full p-3 text-white bg-green-700 outline-none"
                  >
                    Post Update
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dash;
