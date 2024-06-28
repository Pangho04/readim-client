import { useState } from "react";
import { FiMinus } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";
import PropTypes from "prop-types";

import ReadingTime from "./ReadingTime";
import IconButton from "../shared/Button/IconButton";

function Card({
  favicon = "/readimFavicon.png",
  domain,
  articleTitle,
  readingTime,
  mainContent,
  url,
  deleteArticle,
  setArticleSummaryData,
}) {
  const [isDeleted, setIsDeleted] = useState();

  const handleClick = () => {
    setIsDeleted((prev) => !prev);
    setTimeout(() => {
      deleteArticle();
    }, 500);
  };

  const handleShowSummaryClick = () => {
    setArticleSummaryData({
      favicon,
      domain,
      articleTitle,
      readingTime,
      mainContent,
      url,
    });
  };

  return (
    <li
      className={`relative flex flex-col content-center w-48 p-5 list-none transition-all bg-white shadow-md ${isDeleted ? "animate-fade-out" : "animate-scale-in-center"} h-52 shadow-black/25 rounded-3xl group hover:scale-115`}
    >
      <a href={url} target="_blank" className="relative" rel="noreferrer">
        <div className="flex">
          <img className="inline-block w-4" src={favicon} alt="favicon" />
          <p className="text-[11px] w-4/5 truncate inline-block ml-1 font-medium">
            {domain}
          </p>
        </div>
        <ReadingTime readingTime={readingTime} />
        <p className="mt-6 mr-1 text-sm group-hover:pointed-title font-extralight title-ellipsis">
          {articleTitle}
        </p>
      </a>
      <button
        aria-label="openAI-summary"
        className="absolute bottom-5 right-5 text-gray hover:text-black"
        onClick={handleShowSummaryClick}
      >
        <SiOpenai />
      </button>
      <IconButton
        className="hidden group-hover:block"
        onClick={handleClick}
        title="카드 삭제"
      >
        <FiMinus color="gray" strokeWidth={4} />
      </IconButton>
    </li>
  );
}

export default Card;

Card.propTypes = {
  favicon: PropTypes.string,
  domain: PropTypes.string.isRequired,
  articleTitle: PropTypes.string.isRequired,
  readingTime: PropTypes.number.isRequired,
  mainContent: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  deleteArticle: PropTypes.func.isRequired,
  setArticleSummaryData: PropTypes.func.isRequired,
};
