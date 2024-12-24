import React from "react";
import { Button } from "components/ui/inline/Button/Button";
import { DetailAction } from "../../models";
import styles from "./ActionBar.module.scss";

const ActionButton = ({
  action,
  onClickAction,
}: {
  action: DetailAction;
  onClickAction: (a: DetailAction) => void;
}) => {
  const { icon, link, name, to } = action;

  return (
    <Button
      href={to ?? link}
      onClick={() => {
        onClickAction(action);
      }}
      variant="secondary"
      iconVariant="before"
      iconName={icon}
      mobileFullWidth={false}
    >
      {name}
    </Button>
  );
};

export const ActionSidebar = ({ actions, onClickAction }: ActionBarProps) => (
  <>
    {actions.map((action) => (
      <ActionButton
        action={action}
        key={action.name}
        onClickAction={onClickAction}
      />
    ))}
  </>
);

export const ActionBarMobile = ({ actions, onClickAction }: ActionBarProps) => (
  <div className={styles["action-bar-mobile"]}>
    {actions.map((action) => (
      <ActionButton
        action={action}
        key={action.name}
        onClickAction={onClickAction}
      />
    ))}
  </div>
);

export interface ActionBarProps {
  actions: DetailAction[];
  onClickAction: (action: DetailAction) => void;
}
