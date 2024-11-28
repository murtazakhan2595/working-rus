import { Header } from 'components'
import { Card } from 'components/ui/card'
import React, { useEffect, useState } from 'react'
import AddOrganizationForm from '../sections/AddOrganizationForm'
import { getOrganizationData } from 'app/hooks/organization'
import TableCustom from 'components/CustomTable'
import OrganizationAction from '../sections/OrganizationAction'
import AddOrganization from '../sections/AddOrganization'

const OfficeSetting = () => {
  const [data, setData] = useState(null)
  const [edit, setEdit] = useState(false)
  const [editData, setEditData] = useState(null)
  const getOrganization = async ()=>{
    try{
      const response = await getOrganizationData()
      if(response){
        setData(response)
      }
    }
    catch(error){
      console.log("ERROR", error)
    }
  }

  const handleSubmit = (values)=>{
    console.log(values, "FORM SUBMMTIED VALUES")
  }

  useEffect(()=>{
    getOrganization()
  },[])

  const columns = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "name",
      text:"Organization Name"
    },
    {
      dataField:"licensing_authority",
      text:"Licenseing Authority"
    },
    {
      dataField:"email",
      text:"Email"
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <OrganizationAction setEdit={setEdit} setEditData={setEditData} data={row}/>
      ),
    },

  ];

  console.log(edit, editData, "EDIT MODE")
  return (
    <div className="flex flex-col gap-4 profile-management">
        <Header content={<AddOrganization/>}/>
        <Card>
            <TableCustom
            columns={columns}
            data={data || []}
            // tableOptions={tableOptions}
            dataTotalSize={data?.length || 0}
            pagination={true}
            itemsPerPage={10}
            className="organization-table"
            />
        </Card>
    </div>
  )
}

export default OfficeSetting
