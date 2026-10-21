import React from "react";
import { Folder, Still } from "remotion";
import { REEL } from "../common";
import { AftellenCountdown, AftellenFeit1, AftellenFeit2, AftellenPoll } from "./Slides";
import { aftellenSchema, defaultAftellenProps } from "./schema";

const withDays = (daysLeft: number) => ({
  ...defaultAftellenProps,
  countdown: { ...defaultAftellenProps.countdown, daysLeft },
});

const still = (id: string, component: React.FC<any>, defaultProps = defaultAftellenProps) => (
  <Still
    key={id}
    id={id}
    component={component}
    schema={aftellenSchema}
    defaultProps={defaultProps}
    width={REEL.width}
    height={REEL.height}
  />
);

// Story-reeks, 9, 16 en 23 december. Slide 4 bestaat in drie varianten met het echte aantal dagen tot 31 december.
export const Dec08AftellenCompositions: React.FC = () => (
  <Folder name="D08-Aftellen">
    {still("DEC08-Aftellen-1", AftellenPoll)}
    {still("DEC08-Aftellen-2", AftellenFeit1)}
    {still("DEC08-Aftellen-3", AftellenFeit2)}
    {still("DEC08-Aftellen-4", AftellenCountdown)}
    {still("DEC08-Aftellen-4-9dec", AftellenCountdown, withDays(22))}
    {still("DEC08-Aftellen-4-16dec", AftellenCountdown, withDays(15))}
    {still("DEC08-Aftellen-4-23dec", AftellenCountdown, withDays(8))}
  </Folder>
);
