import { Dialog, DialogContent } from '../src/@/components/ui/dialog';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';


const Dialogue = ({ isOpen, setIsOpen, jobId }) => {
  const shareUrl = `https://staging-hrms.tecbrix.cloud/job-description/${jobId}`; 
  const shareMessage = "Check this out!";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="z-[999]">
      <DialogContent className="flex gap-4 justify-center items-center">
        {/* WhatsApp Share */}
        <WhatsappShareButton url={shareUrl} title={shareMessage}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        {/* Email Share */}
        <EmailShareButton url={shareUrl} subject="Interesting Link" body={shareMessage}>
          <EmailIcon size={40} round />
        </EmailShareButton>

        {/* Facebook Share */}
        <FacebookShareButton url={shareUrl} quote={shareMessage}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        {/* LinkedIn Share */}
        <LinkedinShareButton url={shareUrl} title="Check this out" summary={shareMessage}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>
      </DialogContent>
    </Dialog>
  );
};

export default Dialogue;
