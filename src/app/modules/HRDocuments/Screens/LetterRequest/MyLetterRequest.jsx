import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  getLetterRequestList,
} from "app/hooks/hrDocuments";
import CustomTable from "components/CustomTable";
import { Header } from "components";
import { Card, CardContent, CardTitle, CardHeader } from "components/ui/card";
import AddUpdateLetterRequest from "./AddUpdateLetterRequest";
import { MyLetterRequestColumns } from "./LetterRequestColumn";

const MyLetterRequests = ({ userProfile }) => {
  const [requests, setRequests] = useState([]);
  const [isOpenRequest, setIsOpenRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [ordering, setOrdering] = useState("-id");
  const [tableOptions, setTableOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  // Function to handle page/size changes
  const onPageChange = (name, value) => {
    setTableOptions((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch employee letter requests
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getLetterRequestList({
        options: {
          page: tableOptions.page,
          sizePerPage: tableOptions.sizePerPage,
        },
        filterData: {
          employee_id_request: userProfile.id,
        },
        ordering: ordering,
      });

      if (response) {
        setRequests(response.results || []);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error("Error fetching letter requests:", error);
      toast.error("Failed to load your letter requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile.id, tableOptions.page, tableOptions.sizePerPage, ordering]);


  const myRequestsTableOptions = {
    page: tableOptions.page,
    sizePerPage: tableOptions.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button onClick={() => setIsOpenRequest(true)}>Request Letter</Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>My Letter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={requests}
            columns={MyLetterRequestColumns(fetchData, true)}
            pagination={true}
            dataTotalSize={totalCount}
            tableOptions={myRequestsTableOptions}
            loading={loading}
          />
        </CardContent>
      </Card>

      {isOpenRequest && (
        <AddUpdateLetterRequest
          isOpen={isOpenRequest}
          setIsOpen={() => {
            setIsOpenRequest(false);
            fetchData(); // Refresh after creating new request
          }}
          reload={fetchData}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyLetterRequests);
