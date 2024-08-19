import { ChevronLeft } from "lucide-react";
import { cn } from "../../src/@/lib/utils";
import { Button } from "../../src/@/components/ui/button";

import PropTypes from 'prop-types';

function SidebarToggle({ isOpen, setIsOpen }) {
  return (

    <div className=" lg:block xl:block absolute top-[12px] -right-[16px] z-20 hidden" >

      <Button
        onClick={() => setIsOpen?.()}
        className="w-8 h-8 rounded-md"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}


SidebarToggle.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};

export default SidebarToggle;

