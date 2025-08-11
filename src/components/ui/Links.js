"use client";

import React from "react";
import Link from "next/link";
import { useConfig } from "@/context/ConfigContext";

const LinkButton = ({ href, children, newTab }) => {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#ffffff";

  return (
    <Link href={href} className="button" style={{ "--primary-color": primaryColor }} target={newTab ? "_blank" : "_self"} rel={newTab ? "noopener noreferrer" : undefined}>
      {children}
    </Link>
  );
};

const IconLinkButton = ({ href, children, newTab }) => {
  const config = useConfig();
  const primaryColor = config?.primaryColor || "#ffffff";

  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length !== 2) {
    throw new Error("IconButton must have exactly two children: icon and label");
  }

  return (
    <Link href={href} className="icon-button shrink-0" style={{ "--primary-color": primaryColor }} target={newTab ? "_blank" : "_self"} rel={newTab ? "noopener noreferrer" : undefined}>
      <div>{childrenArray[0]}</div>
      <div className="text-white">{childrenArray[1]}</div>
    </Link>
  );
};

export { LinkButton, IconLinkButton };
