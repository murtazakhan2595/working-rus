import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";

const JobsDataTable = ({ baseUrl, token }) => {
  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <RecruitmentDataHeader title="Senior Project Manager" />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        <table className="min-w-full">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th className="px-6 py-3 text-left  rounded-tl-lg">Job Title</th>
              <th className="px-6 py-3 text-left">Job Posted Date</th>
              <th className="px-6 py-3 text-left rounded-tr-lg">
                Total Applicants
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500">
            <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
              <td className="px-6 py-3 text-left">Project Manager</td>
              <td className="px-6 py-3 text-left">23/10/23</td>
              <td className="px-6 py-3 text-left">40</td>
            </tr>
            <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
              <td className="px-6 py-3 text-left">Project Manager</td>
              <td className="px-6 py-3 text-left">23/10/23</td>
              <td className="px-6 py-3 text-left">40</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobsDataTable);
