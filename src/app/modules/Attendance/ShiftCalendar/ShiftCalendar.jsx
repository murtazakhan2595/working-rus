import { Tabs, TabsList, TabsTrigger, TabsContent } from 'src/@/components/ui/tabs';
import { Header } from 'components';
import React, { useState } from 'react'
import Emplist from './Section/Emplist';

const ShiftCalender = () => {
    const [activeTab, setActiveTab] = useState("all");

    const tabsData = [
        { value: "all", label: "All" },
        { value: "my", label: "My" },
        { value: "my-team", label: "My Team" },
      ];

  return (
    <div>
        <Header/>
        <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="all"
      >
        <div className='flex justify-start'>
        <TabsList className="flex justify-center mb-4">
        {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
        </TabsList>

        </div>
        <TabsContent value="all">
            <Emplist/>
        </TabsContent>
        <TabsContent value="my">
            <h1>My</h1>
        </TabsContent>
        <TabsContent value="my-team">
            <h1>My Team</h1>
        </TabsContent>
        </Tabs>
    </div>
  )
}


export default ShiftCalender

