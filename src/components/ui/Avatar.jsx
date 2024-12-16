import {
  Avatar as AvatarUI,
  AvatarImage,
  AvatarFallback,
} from "../../src/@/components/ui/avatar";

const Avatar = ({ src, alt, fallbackText, className, text=null }) => (
  <div title={text}>
    <AvatarUI className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="flex items-center justify-center rounded-full border-plum-500 bg-plum-300">
        {fallbackText?.toUpperCase()}
      </AvatarFallback>
    </AvatarUI>
  </div>
);

export default Avatar;
