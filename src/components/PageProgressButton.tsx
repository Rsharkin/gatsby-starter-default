import React, { useEffect, useRef, useState, useCallback } from "react";
import { isMobile } from "../utils";

export const PageProgressButton = () => {
  const progressSettingInProcess = useRef(null);

  const progressCircle = useRef(null);

  const progressCircleCircumference = useRef(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    updatePageProgress();

    window.addEventListener("scroll", updatePageProgress);

    return () => {
      cancelAnimationFrame(progressSettingInProcess.current);
      window.removeEventListener("scroll", updatePageProgress);
    };
  }, []);

  useEffect(() => {
    const $progressCircle = progressCircle.current;

    const svgWidth = $progressCircle.parentElement.getBoundingClientRect()
      .width;
    const radiusCircle = svgWidth / 2;
    const borderWidth = isMobile() ? 2 : 3;

    $progressCircle.parentElement.setAttribute(
      "viewBox",
      `0 0 ${svgWidth} ${svgWidth}`
    );
    $progressCircle.setAttribute("stroke-width", borderWidth);
    $progressCircle.setAttribute("r", radiusCircle - (borderWidth - 1));
    $progressCircle.setAttribute("cx", radiusCircle);
    $progressCircle.setAttribute("cy", radiusCircle);

    let circumference = radiusCircle * 2 * Math.PI;

    $progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    $progressCircle.style.strokeDashoffset = circumference;

    progressCircleCircumference.current = circumference;
  }, []);

  const handleScrollToTopClick = useCallback(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const updatePageProgress = useCallback(() => {
    if (!progressSettingInProcess.current) {
      progressSettingInProcess.current = requestAnimationFrame(() => {
        const { documentElement } = document;

        const percent = Math.ceil(
          (documentElement.scrollTop /
            (documentElement.scrollHeight - documentElement.clientHeight)) *
            100
        );

        setProgress(
          progressCircleCircumference.current -
            (percent / 100) * progressCircleCircumference.current
        );

        progressSettingInProcess.current = null;
      });
    }
  }, []);

  return (
    <button
      className="m-icon-button filled in-share progress js-scrolltop"
      aria-label="Scroll to top"
      onClick={handleScrollToTopClick}
    >
      <span className="icon-arrow-top" aria-hidden="true"></span>
      <svg aria-hidden="true" style={{ opacity: 1 }}>
        <circle
          className="progress-ring__circle js-progress"
          ref={progressCircle}
          fill="transparent"
          style={{
            strokeDashoffset: progress,
          }}
        ></circle>
      </svg>
    </button>
  );
};

export default PageProgressButton;
