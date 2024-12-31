"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card"

const statsData = [
  { title: "Total Employees", value: 120 },
  { title: "Present", value: 98 },
  { title: "Late", value: 12 },
  { title: "Absent", value: 7 },
  { title: "Not Arrived", value: 3 },
  { title: "Attendance Requests", value: 5 },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center shadow-md border rounded-lg"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-neutral-900">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-medium text-plum-900">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
