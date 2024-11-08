import React from "react";

const ReactMarkdown = ({
  children,
}: {
  children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}) => {
  return <>{children}</>;
};

export default ReactMarkdown;
