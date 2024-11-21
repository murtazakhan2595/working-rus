import { Label } from "../src/@/components/ui/label";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../src/@/components/ui/dialog";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  TwitterIcon,
} from "react-share";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

const Dialogue = ({
  isOpen,
  setIsOpen,
  jobId,
  jobTitle = "FRONTEND",
}) => {
  const shareUrl = `https://staging-hrms.tecbrix.cloud/job-description/${jobId}`;

  // Styled Share Message
  const shareMessage = `
🚀 *Exciting Job Opportunity!*\n\n
💼 *Role*: ${jobTitle}\n\n
👉 Apply now: ${shareUrl}\n
Don't miss this chance to join our team! 🎯
`;

  // Handle Copy to Clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Share Link</DialogTitle>
          <DialogDescription>
            <span className="text-neutral-900">
              Anyone who has the link will be able to view this.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 w-full">
          <div className="w-full gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={shareUrl} readOnly />
          </div>
          <Button
            className="px-3"
            onClick={handleCopyLink}
            aria-label="Copy link"
          >
            <Copy />
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          {/* WhatsApp Share */}
          <WhatsappShareButton url={shareUrl} title={shareMessage}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          {/* Email Share */}
          <EmailShareButton
            url={shareUrl}
            subject="Apply Job Link"
            body={shareMessage}
          >
            <EmailIcon size={40} round />
          </EmailShareButton>

          {/* Facebook Share */}
          <FacebookShareButton url={shareUrl} quote={shareMessage}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          {/* LinkedIn Share */}
          <LinkedinShareButton
            url={shareUrl}
            title="Check this out"
            summary={shareMessage}
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          {/* Twitter Share */}
          <TwitterShareButton url={shareUrl} title={shareMessage}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Dialogue;
