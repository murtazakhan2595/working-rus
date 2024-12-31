import {
  Avatar as AvatarUI,
  AvatarImage,
  AvatarFallback,
} from "src/@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const Avatar = ({ src, alt, fallbackText, className, text = null }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <AvatarUI className={`${className} cursor-pointer `}>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback className="flex items-center justify-center text-sm border rounded-full border-plum-1100 bg-plum-300 text-plum-1100">
            {fallbackText?.toUpperCase()}
          </AvatarFallback>
        </AvatarUI>
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default Avatar;
