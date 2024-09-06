import { updateExitData } from "app/hooks/employee";
import { ExitRequestColumns } from "app/utils/Types/TableColumns";
import { Card, CardContent } from "../../../components/ui/card.jsx";

import TableCustom from "components/TableCustom";
import PageLoader from "components/PageLoader.jsx";
import { useState, useEffect } from "react";
import ExitDetailsCard from "./ExitDetailsCard";
const Terminations = ({ userProfile, terminations, reload, loading }) => {
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const [selectedResignationId, setSelectedResignationId] = useState(null);

  useEffect(() => {
    // When terminations changes, ensure the selected resignation is still valid
    if (
      selectedResignationId &&
      !terminations.find((item) => item.id === selectedResignationId)
    ) {
      setSelectedResignationId(null);
    }
  }, [terminations]);

  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const handleOptionSelect = async (selectedResignation, option) => {
    try {
      if (selectedResignation) {
        selectedResignation = {
          ...selectedResignation,
          status_resignation: option,
        };
        const response = await updateExitData(selectedResignation);
        if (response) {
          reload();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const closeModal = () => {
    setSelectedResignationId(null);
  };

  const handleNext = () => {
    const currentIndex = terminations.findIndex(
      (item) => item.id === selectedResignationId
    );
    if (currentIndex < terminations.length - 1) {
      setSelectedResignationId(terminations[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = terminations.findIndex(
      (item) => item.id === selectedResignationId
    );
    if (currentIndex > 0) {
      setSelectedResignationId(terminations[currentIndex - 1].id);
    }
  };

  const handleRowClicked = (index, data, row) => {
    setSelectedResignationId(row.id);
  };
  return (
    // <div>
    //   <Table
    //     data={terminations || []}
    //     columns={ExitRequestColumns(
    //       handleOptionSelect,
    //       handleRowClicked,
    //       reload,
    //       true
    //     )}
    //     pagination={true}
    //     dataTotalSize={terminations.length || 0}
    //     tableOptions={tableOptions}
    //   />
    //   {selectedResignationId !== null && (
    //     <ExitDetailsCard
    //       resignation={terminations.find(
    //         (item) => item.id === selectedResignationId
    //       )}
    //       onClose={closeModal}
    //       onNext={handleNext}
    //       onPrevious={handlePrevious}
    //       disableNext={
    //         terminations.findIndex(
    //           (item) => item.id === selectedResignationId
    //         ) >=
    //         terminations.length - 1
    //       }
    //       disablePrevious={
    //         terminations.findIndex(
    //           (item) => item.id === selectedResignationId
    //         ) <= 0
    //       }
    //       handleOptionSelect={handleOptionSelect}
    //       reload
    //     />
    //   )}
    // </div>
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            {selectedResignationId !== null && (
              <ExitDetailsCard
                resignation={terminations.find(
                  (item) => item.id === selectedResignationId
                )}
                onClose={closeModal}
                onNext={handleNext}
                onPrevious={handlePrevious}
                disableNext={
                  terminations.findIndex(
                    (item) => item.id === selectedResignationId
                  ) >=
                  terminations.length - 1
                }
                disablePrevious={
                  terminations.findIndex(
                    (item) => item.id === selectedResignationId
                  ) <= 0
                }
                handleOptionSelect={handleOptionSelect}
                reload
              />
            )}
            <TableCustom
              data={terminations || []}
              columns={ExitRequestColumns(
                handleOptionSelect,
                handleRowClicked,
                reload,
                true
              )}
              pagination={true}
              dataTotalSize={terminations.length || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Terminations;
