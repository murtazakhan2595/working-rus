import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { UploadDocumentForm } from "app/modules/HRDocuments";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { Header } from "components";
import {
  getDocumentList,
  getEmployeeTransferStats,
} from "app/hooks/hrDocuments";
import { HRDocumentsColumns } from "app/modules/HRDocuments/Sections";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import Config from "constants/config";

const DocumentTabs = ["All", "Signed", "Pending", "Expired"].filter(Boolean);

export default function Documents() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTransferData, setEmployeeTransferData] = useState({
    results: [],
    count: 0,
  });
  const [employeeTransferStat, setEmployeeTransferStat] = useState({});
  const [OpenUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  const [activeDocumentTab, setActiveDocumentTab] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState(
    userRole === 2 ? { new_reporting_manager: userID } : {}
  );

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
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getDocumentList({
        options,
        filterData,
        ordering,
      });
      if (isMounted) {
        setEmployeeTransferData(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const fetchStatData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getEmployeeTransferStats({
        filterData: { transfer_type: filterData.transfer_type },
      });
      if (isMounted) {
        setEmployeeTransferStat(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

  useEffect(() => {
    let isMounted = true;
    fetchStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData.transfer_type]);

  const statsData = [
    {
      label: "Total",
      value: employeeTransferStat.total_transfers || 0,
      icon: UsersRound,
    },
    {
      label: "Approved",
      value: employeeTransferStat.approved_transfers || 0,
      icon: Contact,
    },
    {
      label: "Rejected",
      value: employeeTransferStat.rejected_transfers || 0,
      icon: UserRoundCheck,
    },
    {
      label: "Pending",
      value: employeeTransferStat.pending_transfers || 0,
      icon: UserRoundCheck,
    },
  ];
  useEffect(() => {
    setFilterData((prevFilter) => ({
      ...prevFilter,
      ...(activeDocumentTab === "All"
        ? { status: "PENDING,VIEWED,ACKNOWLEDGED,EXPIRED" }
        : {}),
      ...(activeDocumentTab === "Signed" ? { status: "ACKNOWLEDGED" } : {}),
      ...(activeDocumentTab === "Expired" ? { status: "EXPIRED" } : {}),
      ...(activeDocumentTab === "Pending" ? { status: "PENDING" } : {}),
    }));
  }, [activeDocumentTab]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "category") setSelectedCategory(filterValue);

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenUploadDocumentForm(true);
            }}
          >
            Upload New Document
          </Button>
        }
      />
      {/* <Stats stats={statsData} /> */}
      <Tabs
        defaultValue="All"
        className="w-full"
        onValueChange={(tab) => {
          setActiveDocumentTab(tab);
        }}
        value={activeDocumentTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {DocumentTabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <FilterInput
            filters={[
              {
                type: "select-one",
                option: Document_Category,
                name: "category",
                placeholder: "Category",
                values: selectedCategory,
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        <Card>
          <CardContent>
            <TableCustom
              data={employeeTransferData.results}
              columns={HRDocumentsColumns}
              pagination={true}
              dataTotalSize={employeeTransferData.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      </Tabs>
      {OpenUploadDocumentForm && (
        <UploadDocumentForm
          isOpen={OpenUploadDocumentForm}
          setIsOpen={() => {
            setOpenUploadDocumentForm(false);
            fetchData(true);
          }}
          transfer_type={
            activeDocumentTab === "Internal" ? "INTERNAL" : "EXTERNAL"
          }
        />
      )}
    </div>
  );
}
