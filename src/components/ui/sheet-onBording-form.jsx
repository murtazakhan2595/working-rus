
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../../src/@/components/ui/sheet"
import { Button } from "../../components/ui/button"
import { Label } from "../../src/@/components/ui/label"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../src/@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../src/@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "../../src/@/components/ui/popover"
import { CalendarDaysIcon, Calendar } from "../../src/@/components/ui/calendar"


function SheetOnBorading() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Employee Onboarding</Button>
      </SheetTrigger>
      <SheetContent className="w-[1800px]">
        <SheetHeader>
          <SheetTitle>Employee Onboarding</SheetTitle>
          <SheetDescription>Fill out the form to onboard a new employee.</SheetDescription>
        </SheetHeader>
        <SheetContent className="grid gap-6 pb-20 overflow-scroll">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee-id">Employee ID</Label>
              <Input id="employee-id" placeholder="Enter employee ID" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">User Name</Label>
              <Input id="username" placeholder="Enter username" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Enter first name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Enter last name" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" type="tel" placeholder="Enter contact number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter address" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select id="department">
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Employee Location</Label>
              <Select id="location">
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nyc">New York City</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" placeholder="Enter designation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="Enter role" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee-type">Employee Type</Label>
              <Select id="employee-type">
                <SelectTrigger>
                  <SelectValue placeholder="Select employee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee-status">Employee Status</Label>
              <Select id="employee-status">
                <SelectTrigger>
                  <SelectValue placeholder="Select employee status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="work-type">Employee Work Type</Label>
              <Select id="work-type">
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="direct-report">Direct Report</Label>
              <Input id="direct-report" placeholder="Enter direct report" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="indirect-report">Indirect Report</Label>
              <Input id="indirect-report" placeholder="Enter indirect report" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department-head">Department Head</Label>
              <Input id="department-head" placeholder="Enter department head" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joining-date">Joining Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start w-full font-normal">
                    Pick a date
                    <div className="w-4 h-4 ml-auto opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </SheetContent>
        <SheetFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Submit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default  SheetOnBorading