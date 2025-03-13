import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Sheet, SheetContent, SheetHeader } from "src/@/components/ui/sheet";

const ViewDetailSheetCardExtension = React.forwardRef(
  (
    {
      handlePrevious = () => {},
      handleNext = () => {},
      isOpen = true,
      title = null,
      setIsOpen = () => {},
      children,
    },
    ref
  ) => {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className={`w-full p-6 sm:max-w-2xl`}>
          <div className="flex flex-col h-full">
            <SheetHeader>
              <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
                <div className="flex flex-wrap">
                  <div className="flex">
                    <span className="text-xl m-auto font-semibold">{title}</span>
                  </div>
                  <div className="flex justify-center ">
                    <button
                      className="flex items-center px-2 py-2"
                      onClick={(e) => handlePrevious(e)}
                    >
                      <IoChevronBack className="" /> Previous
                    </button>
                    <button
                      className="flex items-center px-2 py-2"
                      onClick={(e) => handleNext(e)}
                    >
                      Next <IoChevronForward className="" />
                    </button>
                  </div>
                </div>
              </div>
            </SheetHeader>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
);

export default ViewDetailSheetCardExtension;
