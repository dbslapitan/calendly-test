"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { PopupButton } from "react-calendly";

export default function CalendlyButton({href}: {href: string}){

  const calendlyContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if(!loaded){
      setLoaded(true);
    }
  });

  if(!loaded && !calendlyContainerRef.current){
    return <></>
  }

  return(
    <>
      <PopupButton url={href} text="schedule" rootElement={document.getElementById("container") as HTMLElement}/>
    </>
  );
}