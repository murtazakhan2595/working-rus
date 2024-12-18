import PdfIcon from 'assets/images/pdfPreview.png';
import { MdOutlineFileDownload } from 'react-icons/md';

function ResignationLetter({ name, file }) {

  function handleOpenInNewTab() {
    window.open(file, "_blank", "noopener,noreferrer"); // Opens the file in a new tab
  }

  return (
    <div className="flex flex-col items-start pr-20 mt-5 w-full max-md:pr-5 max-md:max-w-full">
      <h3 className="text-base font-bold leading-none text-zinc-800">
        Resignation Letter
      </h3>
      <div className="flex flex-wrap gap-5 justify-between items-center px-3 pt-2.5 pb-0.5 mt-4 max-w-full bg-gray-100 rounded-lg w-[562px]">
        <div className="flex gap-4">
          <img
            loading="lazy"
            src={PdfIcon}
            alt="PDF Icon"
            className="object-contain shrink-0 aspect-[0.69] w-[25px]"
          />
          <div className="flex flex-col">
            <div className="text-sm leading-none text-zinc-800">
              {name || "Resignation Letter"}
            </div>
          </div>
        </div>
        <button
          className="flex gap-2 my-auto items-center text-sm leading-none whitespace-nowrap text-zinc-800"
          onClick={handleOpenInNewTab}
        >
          <div className="grow">Download</div>
          <MdOutlineFileDownload className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default ResignationLetter;
