'use client'
import React, { useEffect } from "react";


const AdBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}) => {
  useEffect(() => {
    try {
      ((window).adsbygoogle = (window).adsbygoogle || []).push(
        {}
      );
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    React.createElement("ins", {
      className: "adsbygoogle",
      style: { display: "block",width: "100%", minHeight: "250px" },
      "data-ad-client": "ca-pub-5222453839460138",
      "data-ad-slot": dataAdSlot,
      "data-ad-format": dataAdFormat,
      "data-full-width-responsive": dataFullWidthResponsive.toString(),
    })
  );
};

export default AdBanner;
