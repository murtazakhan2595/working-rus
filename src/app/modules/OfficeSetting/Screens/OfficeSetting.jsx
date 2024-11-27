import { Header } from 'components'
import { Card } from 'components/ui/card'
import React from 'react'
import AddOrganizationForm from '../sections/AddOrganizationForm'

const OfficeSetting = () => {
  return (
    <div className="flex flex-col gap-4 profile-management">
        <Header content={<AddOrganizationForm/>}/>
        <Card>
            Hwllo
        </Card>
    </div>
  )
}

export default OfficeSetting
