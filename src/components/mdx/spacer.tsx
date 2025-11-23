type SpacerProps = {
  y?: number;
};

export const Spacer = ({ y = 4 }: SpacerProps) => {
  return <div style={{ height: `${y * 0.25}rem` }} aria-hidden="true" />;
};
