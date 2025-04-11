import pdfIcon from "assets/images/pdfIcon.svg";
import { AiOutlineDownload } from "react-icons/ai";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { downloadAttachmentDirectLink } from "utils/fileUtils";

export const ViewDetailBox = ({ labelList }) => {
  return (
    <div className="mt-3">
      <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg pr-3 pl-4 py-4">
        {labelList &&
          labelList.map((data, index) => {
            return (
              <div className="text-left" key={index}>
                <p class="text-[14px] font-normal">{data?.label}</p>
                <p class="text-[14px] font-semibold">{data?.value ?? "N/A"}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export const ViewAttachmentDetail = ({ title, attachments }) => {
  return (
    <div className="mt-3">
      <h3 className="font-bold text-base text-[#323333] text-left">{title}</h3>
      {attachments &&
        attachments.map((attachment, index) => {
          if (!attachment.file) return "";
          return (
            <div
              key={index}
              className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center my-3"
            >
              <div className="flex gap-x-3">
                <img src={pdfIcon} alt="" />
                <p class="text-[14px] text-[#323333]">
                  <span>{attachment?.name}</span>
                  <div>
                    <a
                      className="self-start mt-1 text-xs leading-none text-zinc-600 text-left"
                      href={attachment.file}
                      target="_blank"
                    >
                      View Document
                    </a>
                  </div>
                </p>
              </div>
              <button
                className="justify-start items-center gap-2.5 inline-flex"
                onClick={(e) => {
                  e.preventDefault();
                  downloadAttachmentDirectLink(
                    attachment.file,
                    attachment?.name
                  );
                }}
              >
                <div className="text-[#5c5e64] text-base font-normal">Download</div>
                <AiOutlineDownload />
              </button>
            </div>
          );
        })}
    </div>
  );
};

export const ViewDetailHeader = ({
  onNextClick,
  onPreviousClick,
  closeModel,
  title,
}) => {
  return (
    <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
      <div className="flex flex-wrap">
        <div className="flex">
          <span className="text-xl m-auto">{title}</span>
        </div>
        <div className="flex justify-center ">
          <button
            className="flex items-center px-2 py-2"
            onClick={() => {
              onPreviousClick();
            }}
          >
            <IoChevronBack className="" /> Previous
          </button>
          <button
            className="flex items-center px-2 py-2"
            onClick={() => onNextClick()}
          >
            Next <IoChevronForward className="" />
          </button>
        </div>
      </div>
    </div>
  );
};
