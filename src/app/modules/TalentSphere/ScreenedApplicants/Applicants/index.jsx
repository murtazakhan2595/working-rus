import React from 'react'
import { CardHeader, CardTitle } from "components/ui/card";
import { ApplicantsTable } from 'app/modules/TalentSphere/ScreenedApplicants';

const Applicants = () => {
  return (
     <>
     <CardHeader className="items-start p-6">
         <CardTitle className="flex flex-row justify-between w-full">
            <div className="font-semibold text-black xl:text-2xl lg:text-xl md:text-lg">
            Screened Applicants
          </div>
         </CardTitle>
     </CardHeader>
     {/* table section */}
     <ApplicantsTable />

     </>
  )
}

export default Applicants