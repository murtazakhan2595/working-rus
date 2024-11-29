import { Button } from 'components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }  from '../../../../src/@/components/ui/dropdown-menu'
import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import ViewOrganization from './ViewOrganization'

const OrganizationAction = ({data, setEdit, setEditData}) => {
  const [view, setView] = useState(null)

  const handleView = (data)=>{
    setView({
      visible: true,
      data: data
    })
  }

  const handleEdit = (data)=>{
    setEdit(true)
    setEditData(data)
  }
  return (
    <>
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button aria-haspopup="true" size="icon" variant="ghost">
        <MoreHorizontal className="w-4 h-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={()=> handleEdit(data)}>Edit</DropdownMenuItem>
      <DropdownMenuItem onClick={()=> handleView(data)}>View</DropdownMenuItem>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
    
    {
      view?.visible && (
        <ViewOrganization
          isOpen={view?.visible}
          setIsOpen={setView}
          data={view?.data}
        />
      )
    }
  </>
  )
}

export default OrganizationAction
