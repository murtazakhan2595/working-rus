'use client'

import React, { useEffect, useState } from "react";
import { BriefcaseIcon, CalendarIcon, UsersIcon } from "lucide-react";
import Header from "../../../../components/Header";
import { FilterInput } from "components/form-control";
import { fetchJobPosts } from "app/hooks/recruitment";
import { PageLoader } from "components";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../src/@/components/ui/tabs";
import Stats from "../../../../components/ui/Stats";
import {
  getJobTypeOptions,
  JobSortingFilters,
  jobsStatusOptions,
  jobTypeOptions
} from '../../../../data/Data';

import JobListingsTable from './JobListingsTable';

import { CreateUpdateJob } from "..";

const safeNumberDisplay = (value) => {
  return Number.isNaN(value) || value === undefined || value === null ? '-' : value;
};

export default function JobsDataTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [sortData, setSortData] = useState("dsc");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedStatus, setSelectedStatus] = useState('');


  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchJobPosts({ ...filterData, status: selectedStatus }, sortData);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getPosts();
  }, [filterData, selectedStatus]);

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
    onPageChange("page", 1);
    if (filterName === "sort_by_date") {
      setSortData(filterCheckStatus ? filterValue : "dsc");
    } else {
      setFilterData((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        if (!filterValue || filterCheckStatus === false) {
          delete updatedFilters[filterName];
        } else {
          updatedFilters[filterName] = filterCheckStatus === false ? "" : filterValue;
        }
        return updatedFilters;
      });
    }
  };

  const statsData = [
    { label: "Total Jobs", value: safeNumberDisplay(posts.count), icon: BriefcaseIcon },
    { label: "Open Jobs", value: safeNumberDisplay(posts.results.filter(job => job.status === "live").length), icon: CalendarIcon },
    { label: "Total Applications", value: safeNumberDisplay(posts.results.reduce((sum, job) => sum + (job.total_applications || 0), 0)), icon: UsersIcon },
  ];

  return (
      <section className="flex flex-col p-[18px] text-sm">
        <Header content={<CreateUpdateJob />} />

        <Stats stats={statsData} />
        <Tabs
          defaultValue=""
          className="w-full"
          onValueChange={(value) => {
            setSelectedStatus(value);  // Set the selected status to filter by
          }}
        >
          <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
            <TabsList className="inline-flex items-center justify-center p-2 bg-white rounded-full text-mauve-900">
              {jobsStatusOptions.map((status) => (
                <TabsTrigger
                  key={status.value}
                  value={status.value}
                  className="data-[state=active]:bg-plum-500 w-28 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
                >
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center space-x-4">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Search by Job Title",
                    name: "id_and_Job_Title",
                  },
                  {
                    type: "select-one",
                    option: getJobTypeOptions(true),
                    name: "Job_Type",
                    placeholder: "Job Type",
                  },
                ]}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          {jobsStatusOptions.map((status) => (
            <TabsContent key={status.value} value={status.value}>
              {isLoading ? (
                <PageLoader />
              ) : (
                <JobListingsTable posts={posts} loading={isLoading}/>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
  );
}
