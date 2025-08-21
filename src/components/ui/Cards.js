"use client";
import Image from "next/image";

const Card = ({ href, children, className = "" }) => {
  return (
    <div className={`bg-white group rounded-md shadow-sm overflow-hidden hover:scale-102 hover:shadow-lg shadow-black/40 transition-all duration-500 ${className}`}>
      {href ? (
        <a href={href} className="block">
          {children}
        </a>
      ) : (
        children
      )}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 border-b border-neutral-200 ${className}`}>{children}</div>;

};

const CardImage = ({ src, alt = "", className = "" }) => {

  return (
    <div className={`border-4 border-b-0 rounded-lg border-white relative w-full aspect-video overflow-hidden ${className}`}>
      <Image src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500" />
    </div>
  );
};

const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-3 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 border-t border-neutral-200 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardImage, CardBody, CardFooter };
