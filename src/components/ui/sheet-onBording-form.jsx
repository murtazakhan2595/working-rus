
import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../../src/@/components/ui/sheet"
import { Button } from "../../components/ui/button"
import { Label } from "../../src/@/components/ui/label"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../src/@/components/ui/textarea"
import { Separator } from "../../src/@/components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../src/@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "../../src/@/components/ui/popover"
import { CalendarDaysIcon, Calendar } from "../../src/@/components/ui/calendar"

export default function SheetOnBorading() {
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default">Add Employee</Button>
      </SheetTrigger>
      <SheetContent className="max-h-[100vh] overflow-auto sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Add Employee</SheetTitle>
          <Button
            onClick={() => setIsFullScreen(!isFullScreen)}
            variant="outline"
          >
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </Button>
          <SheetDescription>Fill out the form to add a new employee to the system.</SheetDescription>
        </SheetHeader>
        <form>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="employee-id">Employee ID</Label>
                <Input id="employee-id" defaultValue="TXB-0368" disabled />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="username">User Name</Label>
                <Input id="username" placeholder="Enter user name" />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="Enter first name" />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Enter last name" />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password" />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="contact">Contact No.</Label>
                <Input id="contact" placeholder="Enter contact number" />
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter address" />
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="department">Department</Label>
                <Select id="department">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="designation">Designation</Label>
                <Select id="designation">
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="role">Role</Label>
                <Select id="role">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="employee-type">Employee Type</Label>
                <Select id="employee-type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="employee-status">Employee Status</Label>
                <Select id="employee-status">
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="work-type">Employee Work Type</Label>
                <Select id="work-type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">Full-time</SelectItem>
                    <SelectItem value="parttime">Part-time</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="direct-report">Direct Report</Label>
                <Select id="direct-report">
                  <SelectTrigger>
                    <SelectValue placeholder="Select direct report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="indirect-report">Indirect Report</Label>
                <Select id="indirect-report">
                  <SelectTrigger>
                    <SelectValue placeholder="Select indirect report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice-williams">Alice Williams</SelectItem>
                    <SelectItem value="david-brown">David Brown</SelectItem>
                    <SelectItem value="sarah-davis">Sarah Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
                <Label htmlFor="department-head">Department Head</Label>
                <Select id="department-head">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department head" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michael-johnson">Michael Johnson</SelectItem>
                    <SelectItem value="emily-wilson">Emily Wilson</SelectItem>
                    <SelectItem value="alex-garcia">Alex Garcia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid items-center gap-4">
              <div className="grid items-center gap-4">
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
          </div>
          <SheetFooter>
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Add Employee</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}