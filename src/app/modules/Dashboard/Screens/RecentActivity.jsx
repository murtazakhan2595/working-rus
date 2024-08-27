
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../src/@/components/ui/card"
import { Button } from 'components/ui/button';

const activities = [
  {
    title: "Deployed new version",
    time: "2h ago",
    description: "Deployed version 2.3.0 with new features and bug fixes.",
  },
  {
    title: "New user signed up",
    time: "1 day ago",
    description: "Welcome @shadcn, our newest community member!",
  },
  {
    title: "Project starred",
    time: "3 days ago",
    description: '@shadcn starred the project "Acme Inc Website".',
  },
];

export default function Component() {
  return (
    <Card className="w-full  min-h-[400px]">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-plum-1100">Recent Activity</div>
          <Button variant="outline" className="">
            <Link to="#">View Details</Link>
          </Button>
        </CardTitle>
        
      </CardHeader>
      <CardContent className="grid gap-4">
      {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 pb-4 border-b">
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
