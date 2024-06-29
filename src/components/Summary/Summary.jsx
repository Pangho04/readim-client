import { Suspense, lazy, useState, useEffect } from "react";
import { FiMinus } from "react-icons/fi";
import PropTypes from "prop-types";

import IconButton from "../shared/Button/IconButton";
import SummarySkeleton from "./SummarySkeleton";

import generateResponse from "../../utils/api";

const SummaryResult = lazy(() => import("./SummaryResult"));

function Summary({
  setArticleSummaryData,
  articleSummaryData = {
    id: "",
    favicon: "",
    domain: "",
    articleTitle: "",
    readingTime: 0,
    mainContent: "",
    url: "",
  },
}) {
  const [messageFadeAnimation, setMessageFadeAnimation] = useState(
    "animate-slide-in-left",
  );
  const [summaryText, setSummaryText] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  useEffect(() => {
    const summaryDatas =
      JSON.parse(window.sessionStorage.getItem("summarys")) || {};
    const articleId = articleSummaryData?.id;

    if (summaryDatas[articleId]) {
      setSummaryText(summaryDatas[articleId]);
    } else {
      generateResponse(articleSummaryData.mainContent)
        .then((summary) => {
          setSummaryText(summary);

          setTimeout(() => {
            summaryDatas[articleSummaryData.id] = summary;
            window.sessionStorage.setItem(
              "summarys",
              JSON.stringify(summaryDatas),
            );
          }, 0);
        })
        .catch(() => {
          setSummaryError(
            "요약 생성 중 에러가 발생했습니다. 다시 시도해주세요.",
          );
        });
    }
  }, [articleSummaryData]);

  const handleCloseSummaryClick = () => {
    setMessageFadeAnimation("animate-slide-out-left");

    const timerId = setTimeout(() => {
      setArticleSummaryData({});
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  };

  return (
    <div
      className={`relative m-auto flex w-136 flex-col backdrop-blur-sm col-span-4 p-8 transition-all shadow-md rounded-3xl group shadow-black/25 ${messageFadeAnimation}`}
    >
      <div>
        <IconButton
          className="hidden group-hover:block"
          onClick={handleCloseSummaryClick}
          title="카드 삭제"
        >
          <FiMinus color="gray" strokeWidth={4} />
        </IconButton>
      </div>
      <div className="grid grid-flow-row auto-rows-min">
        <div className="flex items-start content-start justify-end">
          <span className="flex items-center justify-end w-auto px-5 py-3 mb-3 mr-3 text-base text-white font-extralight max-w-96 rounded-xl bg-gray">
            {articleSummaryData.articleTitle}의 내용을 요약해줘
          </span>
          <img src={articleSummaryData.favicon} alt="favicon" className="w-8" />
        </div>
        <Suspense fallback={<SummarySkeleton />}>
          <SummaryResult summaryText={summaryText} error={summaryError} />
        </Suspense>
      </div>
    </div>
  );
}

export default Summary;

Summary.propTypes = {
  articleSummaryData: PropTypes.shape({
    favicon: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    articleTitle: PropTypes.string.isRequired,
    readingTime: PropTypes.number.isRequired,
    mainContent: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  setArticleSummaryData: PropTypes.func.isRequired,
};
