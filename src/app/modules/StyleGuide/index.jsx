import { Card } from "../../../components/ui/card"
import { 
  CircleHelp, 
  CircleX, 
  Timer, 
  CircleCheck, 
  Circle, 
  MoveUp, 
  MoveRight, 
  MoveDown 
} from "lucide-react"

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

export default function StyleGuide() {
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
    <div className="p-6 space-y-8">
    <h1 className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Colors</h1>
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
      <h1 className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Typography</h1>
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
      <h1 className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Badges</h1>
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
      <h1 className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Status Indicators</h1>
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
      <h1 className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Avatars</h1>
      <div className="space-y-4">
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
      <h1 className="p-2 text-2xl font-bold rounded-md bg-neutral-300 text-neutral-1200">Buttons</h1>
      <div className="space-y-4">
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
    </div>
  )
}