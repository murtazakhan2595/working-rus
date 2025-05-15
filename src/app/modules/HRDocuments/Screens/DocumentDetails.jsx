import moment from "moment";
import React, { useState, useEffect } from "react";
import { SignatureForm } from "app/modules/HRDocuments/Sections";
import { DocCategoryName } from "utils/getValuesFromTables";
import { Button } from "components/ui/button";
import { TableCustom } from "components";
import {
  addUpdateDocumentAssignment,
  getHRDocumentData,
  getDocumentAssignmentList,
} from "app/hooks/hrDocuments";
import { saveEmployeePersonalInfoData } from "app/hooks/employee";
import { mapEmployeeTransferInfo } from "app/utils/MappingObjects/mapEmployeeTransferData";
import AttachmentUI from "components/ui/AttachmentUI";
import { DetailBox, SheetCardExtension } from "components/SheetCardExtension";
import { HRDocumentAssigneesColumns } from "app/modules/HRDocuments/Sections";
import { MyDocumentDetails } from "app/modules/HRDocuments/Screens";

import {
  ViewDetailSheetCardExtension,
  StatusLabel,
  EmployeeOverview,
} from "components";
import { renderDate } from "utils/renderValues";
import { TextInput } from "components/FormControl";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardTitle } from "components/ui/card";
import { SelectInputComponent } from "components/FormControl";
import { HRDocumentsStatus } from "data/Data";
import { calculateTotalCount } from "utils/renderValues";

const DocumentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [currentDocument, setCurrentDocument] = useState({});
  const [DocumentAssignees, setDocumentAssignees] = useState([]);
  const [acknowledgedDocument, setAcknowledgedDocument] = useState(0);
  const [pendingDocument, setPendingDocument] = useState(0);
  const [OpenDocumentID, setOpenDocumentID] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssigneeStatus, setSelectedAssigneeStatus] = useState(null);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
    onRowClick: (row) => {
      setOpenDocumentID(row.id);
      // navigate(`/documents/detail`, {
      //   state: {
      //     GOTO_URLS: `/documents/`,
      //     id: row.id,
      //   },
      // });
    },
  };

  const fetchDocumentAssigneeData = async (isMounted) => {
    try {
      const assigneeResponse = await getDocumentAssignmentList({
        filterData: { document: id },
        ordering,
      });
      if (isMounted && assigneeResponse) {
        setDocumentAssignees(assigneeResponse?.results || []);
        const acknowledgedDocument = calculateTotalCount(
          assigneeResponse?.results,
          "status",
          "ACKNOWLEDGED"
        );
        const pendingDocument = calculateTotalCount(
          assigneeResponse?.results,
          "status",
          "PENDING"
        );
        setPendingDocument(pendingDocument);
        setAcknowledgedDocument(acknowledgedDocument);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchDocumentAssigneeData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [ordering]);

  const fetchData = async (isMounted, documentId) => {
    try {
      const response = await getHRDocumentData(documentId);
      if (isMounted && response) {
        setCurrentDocument(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted, id);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const labelList = [
    {
      label: "Category",
      value: <DocCategoryName value={currentDocument?.category} />,
    },
    ...(currentDocument?.expiration_date
      ? [
          {
            label: "Expiration Date",
            value: renderDate(currentDocument?.expiration_date),
          },
        ]
      : []),
    // ...(currentDocument?.target_audience
    //   ? [
    //       {
    //         label: "Target Audience",
    //         value: currentDocument?.target_audience,
    //       },
    //     ]
    //   : []),
  ].filter(Boolean);

  // Filter employee based on search
  const FilterDocumentAssignees = React.useMemo(() => {
    if (!DocumentAssignees) return [];
    const query = searchQuery.toLowerCase();
    return DocumentAssignees.filter(({ assigned_to_name, status }) => {
      const matchesQuery = assigned_to_name.toLowerCase().includes(query);
      const matchesStatus = selectedAssigneeStatus
        ? status === selectedAssigneeStatus
        : true;
      return matchesQuery && matchesStatus;
    });
  }, [DocumentAssignees, searchQuery, selectedAssigneeStatus]);

  return (
    <>
      <div className="container p-4 mx-auto">
        {/* if the pathname starts with /user/ then show the go back button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              navigate(GOTO_URLS);
            }}
            className="p-4 text-xl text-balance"
          >
            <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
            Go Back
          </Button>
        </div>
        {/* if the pathname is /my-profile then show the header */}
        {/* <Header /> */}
        <div className="my-5">
          <Card>
            <CardContent className="flex flex-col items-start justify-start w-full gap-2 mt-10 max-md:max-w-full ">
              <div className="flex flex-wrap items-center justify-between w-full">
                <div className="ml-1">
                  <div className="text-xl text-neutral-1200 font-bold mb-3">
                    {currentDocument?.name}
                  </div>
                  <div className="flex flex-row gap-1 flex-wrap overflow-hidden">
                    <StatusLabel status={currentDocument.doc_status}>
                      {currentDocument.doc_status?.charAt(0) +
                        currentDocument.doc_status?.slice(1).toLowerCase()}
                    </StatusLabel>
                    <StatusLabel status={currentDocument.acknowledgment_type}>
                      {currentDocument.acknowledgment_type?.charAt(0) +
                        currentDocument.acknowledgment_type
                          ?.slice(1)
                          .toLowerCase()}
                    </StatusLabel>
                    <StatusLabel status={'acknowledged'}>
                      {acknowledgedDocument} Acknowledged
                    </StatusLabel>
                    <StatusLabel status={'rejected'}>
                      {pendingDocument} Pending
                    </StatusLabel>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-4">
          <CardTitle className="text-plum-900 pt-6 px-6">
            Document Detail
          </CardTitle>
          <CardContent className="py-4">
            <div className="mt-6 flex flex-col gap-8">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {labelList &&
                  labelList.map((data, index) => {
                    return (
                      <DetailBox
                        // orientation="horizontal"
                        key={index}
                        className=""
                        label={data.label}
                        value={data.value}
                        fallbackText={""}
                      />
                    );
                  })}
              </div>
              <DetailBox
                // orientation="horizontal"
                className=""
                label={"Description"}
                value={currentDocument.description}
                fallbackText={""}
              />
              <DetailBox
                // orientation="horizontal"
                className=""
                label={"Attachment"}
                value={
                  <AttachmentUI
                    attachment={currentDocument.file}
                    viewOnly={true}
                  />
                }
                fallbackText={""}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardTitle className="text-plum-900 pt-6 px-6">
            Document Assignees
          </CardTitle>
          <CardContent className="py-4">
            <div className="flex flex-col gap-8 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <TextInput
                  name="document_name"
                  placeholder="Search Employee"
                  onChange={(_, value) => {
                    setSearchQuery(value);
                  }}
                  value={searchQuery}
                />
                <SelectInputComponent
                  name="status"
                  value={selectedAssigneeStatus}
                  onChange={(_, value) => {
                    setSelectedAssigneeStatus(value);
                  }}
                  options={HRDocumentsStatus}
                />
              </div>

              <TableCustom
                data={FilterDocumentAssignees}
                columns={HRDocumentAssigneesColumns}
                pagination={false}
                dataTotalSize={FilterDocumentAssignees.length || 0}
                tableOptions={tableOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {OpenDocumentID && (
        <MyDocumentDetails
          documentID={OpenDocumentID}
          isOpen={!!OpenDocumentID}
          setIsOpen={() => {
            setOpenDocumentID(null);
            fetchDocumentAssigneeData(true);
          }}
          DocumentList={DocumentAssignees}
          reloadData={fetchDocumentAssigneeData}
          readOnlyMode={true}
          HRView={true}
        />
      )}
    </>
  );
};

export default DocumentDetails;
