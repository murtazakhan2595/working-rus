
import { useState } from "react";
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const BoardModal = ({ baseUrl, token, onClose, projectId, refreshBoardList }) => {

  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const boardSchema = Joi.object({
    projectName: Joi.string().min(1).max(100).required().label('Board Name'),
    description: Joi.string().min(1).max(5000).required(),
    startDate: Joi.date().iso().required(), // Assuming dates are in ISO format (YYYY-MM-DD)
    dueDate: Joi.date().iso().required(),
    priority: Joi.number().valid(1, 2, 3).required(), // Assuming priority values are 1, 2, or 3
    selectedMembers: Joi.array().items(Joi.number()).min(1).required(), // Assuming member IDs are numbers
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setErrors({});
    const formData = {
      name: projectName,
      project_id: projectId,
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${baseUrl}/board/`, formData, { headers });
      if (response.status === 201) {
        toast.success("Board Added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onClose();
        refreshBoardList();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      // Re-enable the "Done" button after API call, whether successful or not
      setIsLoading(false);
    }

    const dataToValidate = {
      projectName,
    };

    const { error } = boardSchema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setValidationErrors(newErrors);
      return;

    }

  };




  return (
    <>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll h-[100%] flex justify-center items-center backdrop-blur-sm  ">
        <div className="flex items-center justify-center z-50">
          <div className="md:mx-auto pb-10 max-w-3xl relative ">
            <div className="space-y-3 bg-[#F8F8F8] w-96 lg:pt-8 lg:pb-4 py-6 rounded-3xl lg:p-8 p-3 lg:m-6 m-4 lg:max-w-6xl max-w-xs border border-gray-100 shadow-md relative">
              <div
                className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
                onClick={onClose}
              >
                <RxCross2 />
              </div>
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">
                  Create New Board
                </h2>

                <div>
                  {/* ************************ Name ***************************** */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="name"
                      className="font-sfpro text-lg font-semibold"
                    >
                      Board Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={projectName}
                      onChange={(e) => {
                        setValidationErrors((prevErrors) => ({
                          ...prevErrors,
                          projectName: null,
                        }));
                        setProjectName(e.target.value);
                      }}
                      className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-1"
                      placeholder="TecBrix Dashboard Design"
                    />
                    {validationErrors.projectName && (
                      <span className="text-red-500 text-sm">
                        {validationErrors.projectName}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white"
                  disabled={isLoading}
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
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
