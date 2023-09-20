import { useState } from "react";
import Joi from "joi";
import { toast ,ToastContainer  } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const BoardModal = ({ baseUrl, token, onClose }) => {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});

  const boardSchema = Joi.object({
    title: Joi.string().required("Title Required").label("Title").messages({
      "string.empty": `Enter Board Title`,
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const { error } = boardSchema.validate(
      { title: title },
      { abortEarly: false }
    );
    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      return;
    }

    try {

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      };
      
      axios.post(`${baseUrl}/board/`, {
        "name": title,
        "project_id": 1
      }, { headers }) .then((response) => {
        if (response.status === 201) {
            toast.success("Board Added!", {
                position: toast.POSITION.TOP_RIGHT,
            });
            setTimeout(() => {
                onClose();
              }, 2000);
            return;
          }
      }) .catch((error) => {
        toast.error(error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
          });      })
     
    } catch (error) {
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="md:mx-auto w-full max-w-lg relative">
          <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md relative">
            <div
              className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
              onClick={onClose}
            >
              <RxCross2 />
            </div>
            <form className="" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">
                Create New Board
              </h2>
              <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="font-sfpro text-lg font-semibold"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-4"
                  placeholder="Title"
                />
                <div className="text-sm text-rose-500">{errors.title}</div>
              </div>
              <button
                type="submit"
                className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white"
              >
                Done
              </button>
            </form>
          </div>
        </div>
      </div>
        <ToastContainer />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};
export default connect(mapStateToProps)(BoardModal);
