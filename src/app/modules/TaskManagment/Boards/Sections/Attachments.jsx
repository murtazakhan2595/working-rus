import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { connect, useSelector } from "react-redux";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { LiaCommentAlt } from "react-icons/lia";
import {
  fetchComments,
  postComment,
  deleteComment,
  addCommentAttachment,
  getCommentsWithAttachments,
} from "app/hooks/taskManagment";
import { FaRegImage } from "react-icons/fa";
import {
  AiOutlineDownload,
  AiOutlineFile,
  AiOutlinePaperClip,
  AiOutlineSend,
} from "react-icons/ai";
import { EmployeeName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import { filebase64Download } from "utils/fileUtils";

const Attachments = React.memo(({ attachments }) => {
  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }
  if (attachments && attachments.length <= 0) return "";
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center justify-between w-auto my-1 bg-gray-100 p-2 rounded-lg shadow-md"
          onClick={(e) => {
            if (!e.target.closest(".download-icon")) {
              const dataURL = attachment?.attachments.file;
              const [metadata, base64Data] = dataURL.split(",");
              const mimeType = metadata.match(/:(.*?);/)[1];
              const blob = base64ToBlob(base64Data, mimeType);
              const blobUrl = URL.createObjectURL(blob);

              window.open(blobUrl, "_blank");
            }
          }}
        >
          <div className="flex items-center">
            <FaRegImage className="h-4 w-4 text-gray-500" />
            <span className="ml-4 font-lato text-baseGray text-sm">
              {attachment?.attachment?.name}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            <a
              href={attachment?.attachment?.file}
              download
              className="text-gray-500 hover:text-gray-700 download-icon"
            >
              <AiOutlineDownload className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Attachments;
