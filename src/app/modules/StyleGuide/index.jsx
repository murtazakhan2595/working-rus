import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../../../components/ui/card"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "../../../src/@/components/ui/table"
import { Calendar } from "../../../src/@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../src/@/components/ui/tabs"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from "../../../src/@/components/ui/drawer"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, SheetClose } from "../../../src/@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../src/@/components/ui/select"
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "../../../src/@/components/ui/menubar"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../../src/@/components/ui/accordion"

import { Button } from "../../../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../../../src/@/components/ui/radio-group"
import { Switch } from "../../../src/@/components/ui/switch"
import { ScrollArea } from "../../../src/@/components/ui/scroll-area"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../src/@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../../../src/@/components/ui/dialog"

import { Checkbox } from "../../../src/@/components/ui/checkbox"
import { Slider } from "../../../src/@/components/ui/slider"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../../src/@/components/ui/command"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../../src/@/components/ui/hover-card"
import { toast } from "../../../src/@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../src/@/components/ui/tooltip"

import { 
  CircleHelp, 
  CircleX, 
  Timer, 
  CircleCheck, 
  Circle, 
  MoveUp, 
  MoveRight, 
  MoveDown, 
  CalendarDays, 
  Plus, 
  Share, 
  User, 
  Settings,
  Calculator,
  Smile
} from "lucide-react"
import { Label } from "../../../src/@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "../../../src/@/components/ui/avatar"
import { DateTimePicker } from "../../../components/ui/datetime-picker"

// Add new imports

// Add this button data structure before the StyleGuide component
const buttonData = {
  text: [
    {
      label: "Post Job",
      variants: {
        default: "px-8 py-3 font-medium text-white rounded-full bg-neutral-1200 shadow-custom",
        hover: "px-8 py-3 font-medium text-white transition-colors rounded-full bg-neutral-900 hover:bg-neutral-800 shadow-custom",
        disabled: "px-8 py-3 font-medium text-white rounded-full opacity-50 bg-neutral-1200 shadow-custom",
      },
    },
    {
      label: "Continue",
      variants: {
        default: "px-8 py-3 font-medium border rounded-full text-plum-1100 border-plum-300 shadow-custom",
        hover: "px-8 py-3 font-medium transition-colors border rounded-full text-plum-1100 border-plum-300 hover:bg-plum-100 shadow-custom",
        disabled: "px-8 py-3 font-medium border rounded-full opacity-50 text-plum-1100 border-plum-300 shadow-custom",
      },
    },
    {
      label: "Cancel",
      variants: {
        default: "px-8 py-3 font-medium border rounded-full text-neutral-1100 border-neutral-300 shadow-custom",
        hover: "px-8 py-3 font-medium transition-colors border rounded-full text-neutral-1100 border-neutral-300 hover:bg-neutral-100 shadow-custom",
        disabled: "px-8 py-3 font-medium border rounded-full opacity-50 text-neutral-1100 border-neutral-300 shadow-custom",
      },
    },
  ],
  icon: [
    {
      icon: CircleX,
      variants: {
        default: "p-3 border rounded-full text-red-500 border-red-100 shadow-custom",
        hover: "p-3 transition-colors border rounded-full text-red-500 border-red-100 hover:bg-red-50 shadow-custom",
        disabled: "p-3 border rounded-full opacity-50 text-red-500 border-red-100 shadow-custom",
      },
    },
    {
      icon: CircleHelp,
      variants: {
        default: "p-3 border rounded-full text-amber-500 border-amber-100 shadow-custom",
        hover: "p-3 transition-colors border rounded-full text-amber-500 border-amber-100 hover:bg-amber-50 shadow-custom",
        disabled: "p-3 border rounded-full opacity-50 text-amber-500 border-amber-100 shadow-custom",
      },
    },
    {
      icon: CircleCheck,
      variants: {
        default: "p-3 border rounded-full text-emerald-500 border-emerald-100 shadow-custom",
        hover: "p-3 transition-colors border rounded-full text-emerald-500 border-emerald-100 hover:bg-emerald-50 shadow-custom",
        disabled: "p-3 border rounded-full opacity-50 text-emerald-500 border-emerald-100 shadow-custom",
      },
    },
  ],
};

// Add this dummy data structure before the StyleGuide component
const tabData = {
  "Resignations": [
    { name: "John Smith", department: "Engineering", date: "2024-03-01" },
    { name: "Sarah Johnson", department: "Marketing", date: "2024-03-15" },
    { name: "Mike Wilson", department: "Sales", date: "2024-03-20" },
  ],
  "Terminations": [
    { name: "Alex Brown", department: "HR", date: "2024-03-05" },
    { name: "Emily Davis", department: "Finance", date: "2024-03-10" },
    { name: "Tom Harris", department: "IT", date: "2024-03-25" },
  ],
  "Resigned": [
    { name: "Lisa Anderson", department: "Design", date: "2024-02-28" },
    { name: "David Miller", department: "Product", date: "2024-03-12" },
    { name: "Karen White", department: "Operations", date: "2024-03-18" },
  ],
  "Terminated": [
    { name: "Chris Taylor", department: "Legal", date: "2024-03-03" },
    { name: "Rachel Green", department: "Support", date: "2024-03-08" },
    { name: "James Lee", department: "Engineering", date: "2024-03-22" },
  ]
};

export default function StyleGuide() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const colors = {
    primary: [
      { name: "Primary 50", value: "bg-plum-50" },
      { name: "Primary 100", value: "bg-plum-100" },
      { name: "Primary 200", value: "bg-plum-200" },
      { name: "Primary 300", value: "bg-plum-300" },
      { name: "Primary 400", value: "bg-plum-400" },
      { name: "Primary 500", value: "bg-plum-500" },
      { name: "Primary 600", value: "bg-plum-600" },
      { name: "Primary 700", value: "bg-plum-700" },
      { name: "Primary 800", value: "bg-plum-800" },
      { name: "Primary 900", value: "bg-plum-900" },
      { name: "Primary 1000", value: "bg-plum-1000" },
      { name: "Primary 1100", value: "bg-plum-1100" },
      { name: "Primary 1200", value: "bg-plum-1200" },
    ],
   
    success: [
      { name: "Success 50", value: "bg-emerald-50" },
      { name: "Success 100", value: "bg-emerald-100" },
      { name: "Success 200", value: "bg-emerald-200" },
      { name: "Success 300", value: "bg-emerald-300" },
      { name: "Success 400", value: "bg-emerald-400" },
      { name: "Success 500", value: "bg-emerald-500" },

    ],
    warning: [
      { name: "Warning 50", value: "bg-amber-50" },
      { name: "Warning 100", value: "bg-amber-100" },
      { name: "Warning 200", value: "bg-amber-200" },
      { name: "Warning 300", value: "bg-amber-300" },
      { name: "Warning 400", value: "bg-amber-400" },
      { name: "Warning 500", value: "bg-amber-500" },

    ],
    error: [
      { name: "Error 50", value: "bg-red-50" },
      { name: "Error 100", value: "bg-red-100" },
      { name: "Error 200", value: "bg-red-200" },
      { name: "Error 300", value: "bg-red-300" },
      { name: "Error 400", value: "bg-red-400" },
      { name: "Error 500", value: "bg-red-500" },
    
    ],
    neutral: [
      { name: "Neutral 50", value: "bg-neutral-50" },
      { name: "Neutral 100", value: "bg-neutral-100" },
      { name: "Neutral 200", value: "bg-neutral-200" },
      { name: "Neutral 300", value: "bg-neutral-300" },
      { name: "Neutral 400", value: "bg-neutral-400" },
      { name: "Neutral 500", value: "bg-neutral-500" },
      { name: "Neutral 600", value: "bg-neutral-600" },
      { name: "Neutral 700", value: "bg-neutral-700" },
      { name: "Neutral 800", value: "bg-neutral-800" },
      { name: "Neutral 900", value: "bg-neutral-900" },
      { name: "Neutral 1000", value: "bg-neutral-1000" },
      { name: "Neutral 1100", value: "bg-neutral-1100" },
      { name: "Neutral 1200", value: "bg-neutral-1200" },
    ],
  }

// Define typography data
const typographyData = [
  {
    title: "Headings",
    styles: [
      { tag: "h1", className: "text-3xl font-semibold", text: "H1 - The quick brown fox jumps over the lazy dog" },
      { tag: "h2", className: "text-2xl font-semibold", text: "H2 - The quick brown fox jumps over the lazy dog" },
      { tag: "h3", className: "text-xl font-semibold", text: "H3 - The quick brown fox jumps over the lazy dog" },
      { tag: "h4", className: "text-lg font-semibold", text: "H4 - The quick brown fox jumps over the lazy dog" },
      { tag: "h5", className: "text-base font-semibold", text: "H5 - The quick brown fox jumps over the lazy dog" },
      { tag: "h6", className: "text-sm font-semibold", text: "H6 - The quick brown fox jumps over the lazy dog" },
    ],
  },
  {
    title: "Body Text",
    styles: [
      { tag: "p", className: "text-base font-normal", text: "Body - The quick brown fox jumps over the lazy dog" },
      { tag: "p", className: "text-sm font-light", text: "Small Body - The quick brown fox jumps over the lazy dog" },
    ],
  },
  {
    title: "Captions",
    styles: [
      { tag: "p", className: "text-xs font-thin", text: "Caption - The quick brown fox jumps over the lazy dog" },
    ],
  },
];





  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <ScrollArea className="w-64 h-full bg-white border-r">
          <div className="p-4 space-y-2">
            <h6 className="mb-4 font-semibold">Components</h6>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('colors')}>Colors</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('typography')}>Typography</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('badges')}>Badges</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('status-indicators')}>Status Indicators</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('avatars')}>Avatars</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('buttons')}>Buttons</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('forms')}>Forms</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('tabs')}>Tabs</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('calendar')}>Calendar</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('select')}>Select</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('radio')}>Radio</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('switch')}>Switch</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('accordion')}>Accordion</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('sheet')}>Sheet</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('menubar')}>Menubar</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('table')}>Table</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('drawer')}>Drawer</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('input')}>Input & Textarea</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('dialog')}>Dialog</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('hovercard')}>Hover Card</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('command')}>Command</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('toast')}>Toast</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('tooltip')}>Tooltip</Button>
            <Button variant="ghost" className="justify-start w-full" onClick={() => scrollToSection('datetime-picker')}>DateTime Picker</Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-8">
        <h1 id="colors" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Colors</h1>
        {Object.entries(colors).map(([category, shades]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold capitalize">{category}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {shades.map((color) => (
                <Card key={color.name} className="p-4 space-y-3 rounded-md">
                  <div
                    className={`w-full h-24 rounded-md ${color.value}`}
                    role="img"
                    aria-label={`Color ${color.name}`}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{color.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                      {color.value}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        <h1 id="typography" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Typography</h1>
        {/* Dynamic Typography Styles Component */}
        <div className="typography-section">
          {typographyData.map(group => (
            <div key={group.title} className="mb-4">
              <h3 className="text-2xl font-bold">{group.title}</h3>
              {group.styles.map(style => {
                const Tag = style.tag; // Dynamic tag based on data
                return <Tag key={style.text} className={style.className}>{style.text}</Tag>;
              })}
            </div>
          ))}
        </div>
        <h1 id="badges" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Badges</h1>
        <div className="flex flex-row gap-4 space-y-2">
          <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold">Solid Color Badges</h2>
          {/* Solid Color Badges */}
          {[
            { bg: "bg-plum-300", text: "Badge", color: "text-plum-1100"  },
            { bg: "bg-red-100", text: "Badge", color: "text-red-500" },
            { bg: "bg-amber-100", text: "Badge", color: "text-amber-500" },
            { bg: "bg-emerald-100", text: "Badge", color: "text-emerald-500" },
            { bg: "bg-neutral-300", text: "Badge", color: "text-neutral-1100" },
          ].map((badge, index) => (
            <div key={index} className={`px-4 py-2 rounded-full w-40 flex items-center justify-center ${badge.bg} ${badge.color}`}>
              {badge.text}
            </div>
          ))}
          </div>  
          <div className="flex-1 space-y-2">
          <h2 className="text-lg font-semibold">Badges with Dots</h2>
          {/* Badges with Dots */}
          {[
            { bg: "bg-white", dot: "bg-plum-1100", text: "Badge" },
            { bg: "bg-white", dot: "bg-red-100", text: "Badge" },
            { bg: "bg-white", dot: "bg-amber-500", text: "Badge" },
            { bg: "bg-white", dot: "bg-emerald-500", text: "Badge" },
            { bg: "bg-white", dot: "bg-neutral-500", text: "Badge" },
          ].map((badge, index) => (
            <div key={index} className={`px-4 py-2 rounded-full w-40 border border-neutral-300 flex gap-2 items-center justify-center ${badge.bg}`}>
              <span className={`w-3 h-3 rounded-full ${badge.dot}`}></span>
              <span>{badge.text}</span>
            </div>
          ))}
          </div>
        </div>
        {/* Status Indicators Section */}
        <h1 id="status-indicators" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Status Indicators</h1>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[
              { label: "Backlog", color: "text-plum-1100", Icon: CircleHelp },
              { label: "Canceled", color: "text-red-500", Icon: CircleX },
              { label: "In Progress", color: "text-amber-500", Icon: Timer },
              { label: "Done", color: "text-emerald-500", Icon: CircleCheck },
              { label: "Todo", color: "text-neutral-1000", Icon: Circle },
              { label: "High", color: "text-red-500", Icon: MoveUp },
              { label: "Medium", color: "text-amber-500", Icon: MoveRight },
              { label: "Low", color: "text-neutral-1000", Icon: MoveDown },
            ].map((status) => (
              <div key={status.label} className="flex items-center gap-2">
                <status.Icon className={`w-6 h-6 ${status.color}`} />
                <span className={status.color}>{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avatars Section */}
        <h1 id="avatars" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Avatars</h1>
        <div className="space-y-4 ">
          <div className="flex flex-wrap gap-4">
            {[
              { bg: "bg-neutral-200", text: "CN" },
              { bg: "bg-emerald-100", text: "CN", textColor: "text-emerald-500" },
              { bg: "bg-amber-100", text: "CN", textColor: "text-amber-500" },
              { bg: "bg-red-100", text: "CN", textColor: "text-red-500" },
            ].map((avatar, index) => (
              <div
                key={index}
                className={`${avatar.bg} ${avatar.textColor || 'text-neutral-600'} w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium`}
              >
                {avatar.text}
              </div>
            ))}
          </div>
        </div>
        {/* Buttons Section */}
        <h1 id="buttons" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Buttons</h1>
        
        <div className="flex flex-row gap-4 space-y-4">
        
          {/* Default State */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Default State</h2>
            {/* Default State Buttons */}
            <div className="flex flex-row gap-4">
            {buttonData.text.map((button, index) => (
              <button key={index} className={button.variants.default}>{button.label}</button>
            ))}
            </div>
            {/* Default State Icons */}
            <div className="flex flex-row gap-4">
            {buttonData.icon.map((button, index) => (
              <button key={index} className={button.variants.default}>
                <button.icon className="w-6 h-6" />
              </button>
            ))}
            </div>
          </div>
          {/* Hover State */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Hover State</h2>
            {/* Hover State Buttons */}
            <div className="flex flex-row gap-4">
            {buttonData.text.map((button, index) => (
              <button key={index} className={button.variants.hover}>{button.label}</button>
            ))}
            </div>
            {/* Hover State Icons */}
            <div className="flex flex-row gap-4">
            {buttonData.icon.map((button, index) => (
              <button key={index} className={button.variants.hover}>
                <button.icon className="w-6 h-6" />
              </button>
            ))}
            </div>
          </div>
          
          {/* Disabled State */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Disabled State</h2>
            {/* Disabled State Buttons */}
            <div className="flex flex-row gap-4">
            {buttonData.text.map((button, index) => (
              <button key={index} className={button.variants.disabled}>{button.label}</button>
            ))}
            </div>
            {/* Disabled State Icons */}
            <div className="flex flex-row gap-4">
            {buttonData.icon.map((button, index) => (
              <button key={index} className={button.variants.disabled}>
                <button.icon className="w-6 h-6" />
              </button>
            ))}
            </div>
          </div>
        </div>
        <h1 id="forms" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Forms</h1>
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>Various form input elements and their states</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Text Input */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Text Input</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="default">Default Input</Label>
                  <Input id="default" placeholder="Default input" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" placeholder="Disabled input" disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="error" className="text-red-500">Error Input</Label>
                  <Input 
                    id="error" 
                    placeholder="Error state" 
                    className="border-red-500 focus-visible:ring-red-500" 
                  />
                  <p className="text-sm text-red-500">This field is required</p>
                </div>
              </div>
            </div>

            {/* Select */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select</h3>
              <div className="grid gap-2">
                <Label htmlFor="framework">Framework</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Radio Group */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Radio Group</h3>
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Comfortable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3">Compact</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Checkbox */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Checkbox</h3>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
            </div>

            {/* Switch */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Switch</h3>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
            </div>

            {/* Textarea */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Textarea</h3>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here." 
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <h1 id="tabs" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Tabs</h1>

        {/* Tabs Example */}
    
          
          <Card className="p-6 bg-neutral-700">
            <h2 className="mb-4 text-lg font-semibold">Tabs with Data</h2>
            <Tabs defaultValue="Resignations" className="w-fit">
              <TabsList className="h-12 p-1 rounded-lg bg-purple-50/50 w-fit">
                {Object.keys(tabData).map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="relative h-10 px-4 rounded-md font-medium text-neutral-600 data-[state=active]:text-purple-600 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all w-28"
                   >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {Object.entries(tabData).map(([tab, data]) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead className="bg-neutral-100">
                        <tr>
                          {Object.keys(data[0]).map((header) => (
                            <th key={header} className="p-3 font-medium text-left">
                              {header.charAt(0).toUpperCase() + header.slice(1)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index} className="border-t">
                            {Object.values(item).map((value, i) => (
                              <td key={i} className="p-3">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
     
        <h1 id="calendar" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Calendar</h1>
        {/* Calendar Example */}
        <Card className="p-6 max-w-[840px] mx-auto">
          <h2 className="mb-4 text-lg font-semibold">Calendar</h2>
          <Calendar />
        </Card>

        {/* Select Example */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Select</h2>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Radio Group Example */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Radio Group</h2>
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Option Two</Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Switch Example */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Switch</h2>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
        </Card>

        {/* Tabs with Data */}
       
        {/* Accordion Section */}
        <h1 id="accordion" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Accordion</h1>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Accordion Example</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches your design system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Sheet Section */}
        <h1 id="sheet" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Sheet</h1>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Sheet Example</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Sheet Title</SheetTitle>
                <SheetDescription>
                  This is a description of the sheet content.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Card>

        {/* Menubar Section */}
        <h1 id="menubar" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Menubar</h1>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Menubar Example</h2>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New Tab</MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarItem>Share</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Card>

        {/* Table Section */}
        <h1 id="table" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Table</h1>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Table Example</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Developer</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Inactive</TableCell>
                <TableCell>Designer</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Drawer Section */}
        <h1 id="drawer" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Drawer</h1>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Drawer Example</h2>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit Profile</DrawerTitle>
                <DrawerDescription>
                  Make changes to your profile here. Click save when you're done.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="drawer-name">Name</Label>
                  <Input id="drawer-name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drawer-username">Username</Label>
                  <Input id="drawer-username" />
                </div>
              </div>
              <DrawerFooter>
                <Button>Save changes</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Card>

        {/* Sheet Section */}
        <h1 id="sheet" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Sheet</h1>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Sheet Example</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="sheet-name" className="text-right">Name</Label>
                  <Input id="sheet-name" defaultValue="Pedro Duarte" className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Card>

        {/* Card Section with all components */}
        <h1 id="card" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Card</h1>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <p>Footer content here</p>
          </CardFooter>
        </Card>

        {/* Table Section with all components */}
        <h1 id="table" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Table</h1>
        <Table>
          <TableCaption>A list of your recent invoices</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Input and Textarea Section */}
        <h1 id="input" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Input & Textarea</h1>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here" />
            </div>
          </div>
        </Card>

        {/* Dialog Section */}
        <h1 id="dialog" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Dialog</h1>
        <Card className="p-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        {/* Input Components */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Input Components</CardTitle>
            <CardDescription>Collection of input form elements and their states</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Text Input */}
            <div className="grid gap-2">
              <Label htmlFor="text">Text Input</Label>
              <Input id="text" placeholder="Enter text..." />
            </div>

            {/* Textarea */}
            <div className="grid gap-2">
              <Label htmlFor="message">Textarea</Label>
              <Textarea id="message" placeholder="Type your message here..." />
            </div>

            {/* Switch */}
            <div className="flex items-center gap-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>

            {/* Radio Group */}
            <div className="flex items-center space-x-2">
              <RadioGroup defaultValue="option-one">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
             
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Option Two</Label>
            </RadioGroup>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>

            {/* Slider */}
            <div className="grid gap-2">
              <Label htmlFor="slider">Slider</Label>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </CardContent>
        </Card>

        {/* Sheet Section */}
        <h1 id="sheet" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Sheet</h1>
        <Card className="p-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="sheet-name" className="text-right">Name</Label>
                  <Input id="sheet-name" defaultValue="Pedro Duarte" className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Card>

        {/* Accordion Section */}
        <h1 id="accordion" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Accordion</h1>
        <Card className="p-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches your app's design.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Calendar Section */}
        <h1 id="calendar" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Calendar</h1>
        <Card className="p-6">
          <Calendar />
        </Card>

        {/* Command (Search) Section */}
        <h1 id="command" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Command</h1>
        <Card>
          <CardHeader>
            <CardTitle>Command</CardTitle>
            <CardDescription>Command menu for quick actions and search</CardDescription>
          </CardHeader>
          <CardContent>
            <Command className="border rounded-lg shadow-md">
              <CommandInput placeholder="Type a command or search..." className="h-9" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem className="flex items-center gap-2 px-4 py-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>Calendar</span>
                  </CommandItem>
                  <CommandItem className="flex items-center gap-2 px-4 py-2">
                    <Smile className="w-4 h-4" />
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem className="flex items-center gap-2 px-4 py-2">
                    <Calculator className="w-4 h-4" />
                    <span>Calculator</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem className="flex items-center gap-2 px-4 py-2">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem className="flex items-center gap-2 px-4 py-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </CardContent>
        </Card>

        {/* HoverCard Section */}
        <h1 id="hovercard" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Hover Card</h1>
        <Card>
          <CardHeader>
            <CardTitle>Hover Card</CardTitle>
            <CardDescription>For showing additional content on hover</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center space-x-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">@nextjs</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/vercel.png" />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@nextjs</h4>
                    <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
                    <div className="flex items-center pt-2">
                      <CalendarDays className="w-4 h-4 mr-2 opacity-70" />
                      <span className="text-xs text-slate-500">Joined December 2021</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardContent>
        </Card>

        {/* Tooltip Section */}
        <h1 id="tooltip" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Tooltip</h1>
        <Card>
          <CardHeader>
            <CardTitle>Tooltip</CardTitle>
            <CardDescription>Tooltips for showing additional information</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    <Share className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>

        {/* DateTime Picker Section */}
        <h1 id="datetime-picker" className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">DateTime Picker</h1>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>DateTime Picker Examples</CardTitle>
            <CardDescription>Various datetime picker configurations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* 24-Hour Format */}
            <div className="space-y-2">
              <Label>24-Hour Format</Label>
              <DateTimePicker />
            </div>

            {/* 12-Hour Format */}
            <div className="space-y-2">
              <Label>12-Hour Format</Label>
              <DateTimePicker 
                hourCycle={12}
                displayFormat={{
                  hour12: "PP hh:mm:ss b"
                }}
              />
            </div>

            {/* Different Granularities */}
            <div className="space-y-2">
              <Label>Minutes Only</Label>
              <DateTimePicker granularity="minute" />
            </div>

            <div className="space-y-2">
              <Label>Hours Only</Label>
              <DateTimePicker granularity="hour" />
            </div>

            <div className="space-y-2">
              <Label>Date Only</Label>
              <DateTimePicker granularity="day" />
            </div>

            {/* Custom Year Range */}
            <div className="space-y-2">
              <Label>Custom Year Range (±10 years)</Label>
              <DateTimePicker yearRange={10} />
            </div>

            {/* Custom Placeholder */}
            <div className="space-y-2">
              <Label>Custom Placeholder</Label>
              <DateTimePicker placeholder="Select date and time" />
            </div>

            {/* Disabled State */}
            <div className="space-y-2">
              <Label>Disabled</Label>
              <DateTimePicker disabled />
            </div>

            {/* Custom Format */}
            <div className="space-y-2">
              <Label>Custom Format</Label>
              <DateTimePicker 
                displayFormat={{
                  hour24: "PPP 'at' HH:mm:ss"
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}