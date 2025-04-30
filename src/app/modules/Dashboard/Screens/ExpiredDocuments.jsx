import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
  getDocumentList,
  getDocumentAssignmentList,
} from "app/hooks/hrDocuments";
import { Button } from "components/ui/button";
import { FileWarning } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DocCategoryName } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";
import { StatusLabel } from "components";
import { useSelector } from "react-redux";

const ExpiredDocuments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expiredDocuments, setExpiredDocuments] = useState([]);
  const navigate = useNavigate();

  // Get user role and ID from Redux store
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);

  // Define if user is HR/admin or employee
  const isHROrAdmin = userRole !== 4; // Assuming 4 is employee role

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let data;

      if (isHROrAdmin) {
        // For HR/admin: get all expired documents
        data = await getDocumentList({
          filterData: { doc_status: "Expired" },
          options: { page: 1, sizePerPage: 5 }, 
        });
      } else {
        // For employees: get their assigned expired documents
        data = await getDocumentAssignmentList({
          options: { page: 1, sizePerPage: 5 },
          filterData: { emp: userID, status: "EXPIRED" },
          ordering: "-id",
        });
      }

      if (data && data.results) {
        setExpiredDocuments(data.results);
      }
    } catch (error) {
      console.error("Error fetching expired documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 300000);

    return () => clearInterval(intervalId);
  }, [isHROrAdmin, userID]);

  const handleViewAll = () => {
    // Navigate to different pages based on user role
    if (isHROrAdmin) {
      navigate("/documents");
    } else {
      navigate("/my-documents");
    }
  };

  // Render document item based on user role
  const renderDocumentItem = (doc) => {
    if (isHROrAdmin) {
      // For HR/admin: show document info
      return (
        <div
          key={doc.id}
          className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">{doc.name}</span>
            <div className="flex items-center gap-2 mt-1">
              <DocCategoryName value={doc.category} />
              <span className="text-xs text-neutral-1200">
                {doc.target_audience}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <StatusLabel status="Expired" className="text-xs">
              Expired
            </StatusLabel>
            <span className="text-xs text-neutral-1200 mt-1">
              {renderDate(doc.expiration_date)}
            </span>
          </div>
        </div>
      );
    } else {
      // For employees: show assigned document info
      return (
        <div
          key={doc.id}
          className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
          onClick={() => navigate(`/my-documents?id=${doc.id}`)}
        >
          <div className="flex flex-col">
            <span className="font-medium text-sm">{doc.document_name}</span>
            <div className="flex items-center gap-2 mt-1">
              <DocCategoryName value={doc.document_category} />
              <span className="text-xs text-neutral-1200">
                Assigned: {renderDate(doc.assigned_date)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <StatusLabel status={doc.status} className="text-xs">
              {doc.status}
            </StatusLabel>
            <span className="text-xs text-neutral-1200 mt-1">
              {doc.due_date ? renderDate(doc.due_date) : "No due date"}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          {isHROrAdmin ? "Expired Documents" : "My Expired Documents"}
        </CardTitle>
        <Button onClick={handleViewAll} variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading...</p>
          </div>
        ) : expiredDocuments.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <FileWarning className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-neutral-1200">No expired documents found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expiredDocuments.map(renderDocumentItem)}

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-neutral-1200">
                {expiredDocuments.length} of{" "}
                {expiredDocuments.length >= 5 ? "5+" : expiredDocuments.length}{" "}
                displayed
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAll}
                className="text-xs"
              >
                {isHROrAdmin ? "Manage Documents" : "View My Documents"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiredDocuments;
