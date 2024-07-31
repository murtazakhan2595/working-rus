import * as React from "react";
import { useState, useEffect } from "react";
import { FaChevronRight, FaPlus, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Table } from "components";
import { DashbaordJobApplicationColumns } from "app/utils/Types/TableColumns";
import { fetchJobPosts } from "app/hooks/recruitment";
import { PageLoader } from "components";
import { useNavigate } from "react-router-dom";
import { getJobApplications, getJobApplicants } from "app/hooks/recruitment";

const TalentSphere = () => {
  const [posts, setPosts] = useState([]);
  const [applicantsData, setApplicantsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchJobPosts();
      setPosts(data.results);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchLists = async () => {
    try {
     
      const applicants = await getJobApplicants();
      if(applicants){
        setApplicantsData(applicants)
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsApplicantsLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
    fetchLists();
  }, []);

  return (
    <div className="flex flex-col pt-6 pb-3 pl-3.5 bg-white rounded-md shadow w-[860px] ">
      <div className="flex gap-4 justify-between w-full max-md:flex-wrap">
        <div className="flex gap-3 p-3 text-lg tracking-tight leading-5 rounded-lg text-zinc-800">
          <FaRegStar />
          <div>Talent Sphere</div>
        </div>
        <div className="flex gap-5 pl-20 my-auto max-md:flex-wrap">
          <Link to="/jobs">
            <div className="flex gap-1.5 justify-center px-2.5 py-2 my-auto text-xs leading-5 text-black rounded items-center ">
              <div className="grow my-auto">View All</div>
              <FaChevronRight size={11} />
            </div>
          </Link>
          <Link to="/job-post">
            <div className="flex gap-1 justify-center items-center px-4 py-2 text-sm text-white bg-black rounded-xl mr-2">
              <div>Add Job</div>
              <FaPlus className="text-white" />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex gap-5 justify-between pr-5 mt-4 max-md:flex-wrap">
        <div className="flex flex-col justify-end max-md:max-w-full h-fit">
          <div className="flex gap-3 max-md:flex-wrap">
            <TitleCard label={"Job Opening"} value={6} />
            <TitleCard label={"Applications"} value={50} />
            <TitleCard label={"Shortlisted"} value={20} />
            <TitleCard label={"Interview"} value={5} />
          </div>

          <div className="flex flex-col justify-center mt-4 text-sm bg-gray-50 rounded-xl text-zinc-800 max-md:max-w-full limit m-bottom-zero">
            {isLoading ? (
              <PageLoader />
            ) : (
              <Table
                columns={DashbaordJobApplicationColumns(navigate)}
                data={posts}
                pagination={false}
                rowExpand={false}
                tableOptions={{ onRowClick: false }}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col pb-16 w-full h-fit">
          <div className="text-sm font-bold leading-5 text-zinc-800">
            Ongoing process
          </div>
          {isApplicantsLoading ? (
            <PageLoader />
          ) : (
            <RenderApplicants applicantsData={applicantsData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentSphere;

const TitleCard = ({ label, value }) => {
  return (
    <div className="flex gap-4 p-2 bg-gray-50 rounded-md border border-solid border-zinc-300">
      <div className="flex justify-center items-center my-auto w-6 h-6 bg-sky-500 bg-opacity-10  rounded-[100px]">
        <HiOutlineBars3 className="text-sky-600" />
      </div>
      <div className="flex flex-col justify-center py-px">
        <div className="text-xs text-zinc-600">{label}</div>
        <div className="mt-1 text-base text-zinc-800">{value}</div>
      </div>
    </div>
  );
};

const RenderApplicants = ({ applicantsData }) => {
  return (
    <div className="h-96 overflow-y-auto">
      {applicantsData.map((applicant) => (
        <div
          key={applicant.id} // Replace 'applicant.id' with a unique identifier from your applicant data
          className="flex gap-5 justify-between py-1 mt-6 bg-white"
        >
          <div className="flex gap-4">
            <div className="my-auto text-xs text-zinc-600">{applicant.id}</div>{" "}
            <div className="flex flex-col text-zinc-600">
              <div className="text-sm font-bold tracking-tight">
                {applicant.full_name}
              </div>
              <div className="text-xs tracking-tight">
                {applicant.job_title}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 my-auto text-sm leading-4 whitespace-nowrap text-zinc-600">
            <div className="shrink-0 my-auto w-2.5 h-2.5 rounded-full border border-amber-500 border-solid stroke-[1px]" />
            <div>{applicant.application_status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
