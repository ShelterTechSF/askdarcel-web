import React from "react";
import { Link } from "react-router-dom";
import { icon as iconPath } from "../../assets";
import { OrganizationAction } from "../../models";
import "./ActionBar.scss";

const ActionButton = ({
  action,
  onClickAction,
  iconColor,
  listItemClass,
}: {
  action: OrganizationAction;
  iconColor: string;
  listItemClass?: string;
  onClickAction: (a: OrganizationAction) => void;
}) => {
  const { icon, link, name, to } = action;
  const linkClass = `action-sidebar--${name.toLowerCase()}`;
  const content = (
    <>
      <img
        className=""
        src={iconPath(`${icon}-${iconColor}`)}
        alt={icon}
      />
      <span>{name}</span>
    </>
  );

  return (
    <li className={listItemClass}>
      {to ? (
        <Link to={to} className={linkClass}>
          {content}
        </Link>
      ) : (
        <a
          className={linkClass}
          href={link}
          onClick={() => {
            onClickAction(action);
          }}
          rel="noopener noreferrer"
          target="_blank"
        >
          {content}
        </a>
      )}
    </li>
  );
};

export const ActionSidebar = ({ actions, onClickAction }: ActionBarProps) => (
  <ul className="action-sidebar">
    {actions.map((action) => (
      <ActionButton
        action={action}
        iconColor="gray"
        key={action.name}
        onClickAction={onClickAction}
      />
    ))}
  </ul>
);

export const ActionBarMobile = ({ actions, onClickAction }: ActionBarProps) => (
  <ul className="mobile-action-bar">
    {actions.map((action) => (
      <ActionButton
        action={action}
        iconColor="blue"
        key={action.name}
        listItemClass="mobile-action-bar--listitem"
        onClickAction={onClickAction}
      />
    ))}
  </ul>
);

export interface ActionBarProps {
  actions: OrganizationAction[];
  onClickAction: (action: OrganizationAction) => void;
}
