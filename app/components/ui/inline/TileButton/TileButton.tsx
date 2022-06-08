import React from 'react';

import styles from './TileButton.module.scss';

/**
 * A larger than normal button. It currently uses default colors
 * and two sizes, but this can be expanded in the future.
 */

type Size = 'medium' | 'large';

type Props = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: Size;
  addClass?: string;
};

const TileButton = ({
  text,
  onClick,
  size,
  addClass,
}: Props) => (
  <button
    onClick={onClick}
    className={`${size ? styles[size] : ''} ${addClass || ''}`}>
    {text}
  </button>
);

export default TileButton;
