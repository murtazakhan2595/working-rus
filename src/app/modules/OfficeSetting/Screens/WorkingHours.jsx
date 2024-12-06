import TableCustom from 'components/CustomTable'
import { CardContent } from 'components/ui/card'
import { Card } from 'components/ui/card'
import React from 'react'

const WorkingHours = () => {
    const columns = [
        {
            text:""
        }
    ]
  return (
    <Card>
      <CardContent>
      {/* <TableCustom
        columns={columns}
        // data={department?.results || []}
        // tableOptions={tableOptions}
        dataTotalSize={department?.results?.length || 0}
        pagination={true}
        itemsPerPage={100}
        className="organization-table"
      /> */}
      </CardContent>
    </Card>
  )
}

export default WorkingHours
