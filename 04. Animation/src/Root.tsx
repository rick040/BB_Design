import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { Ad } from "./Ad";
import { CountdownAd } from "./countdown/CountdownAd";
import {
  type CountdownProps,
  countdownSchema,
  countdownTotal,
  defaultCountdownProps,
} from "./countdown/schema";
import { PrivacyAd } from "./privacy/PrivacyAd";
import { defaultPrivacyProps, type PrivacyProps, privacySchema, privacyTotal } from "./privacy/schema";
import { type AdProps, adSchema, defaultAdProps, FPS, totalFrames } from "./schema";

const adMetadata: CalculateMetadataFunction<AdProps> = ({ props }) => ({
  durationInFrames: totalFrames(props.timing),
});

const countdownMetadata: CalculateMetadataFunction<CountdownProps> = ({ props }) => ({
  durationInFrames: countdownTotal(props.timing),
});

const privacyMetadata: CalculateMetadataFunction<PrivacyProps> = ({ props }) => ({
  durationInFrames: privacyTotal(props.timing),
});

export const RemotionRoot: React.FC = () => (
  <>
    {/* Concept 1 · "Stuur door. Buddy onthoudt." (CONCEPT.md) */}
    <Folder name="Concept-1-Stuur-door">
      <Composition
        id="BB-Ad-Reel"
        component={Ad}
        schema={adSchema}
        defaultProps={defaultAdProps}
        calculateMetadata={adMetadata}
        durationInFrames={totalFrames(defaultAdProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-Ad-Feed"
        component={Ad}
        schema={adSchema}
        defaultProps={defaultAdProps}
        calculateMetadata={adMetadata}
        durationInFrames={totalFrames(defaultAdProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>

    {/* Concept 2 · "7 · 2 · Betaald." (CONCEPT-2.md) */}
    <Folder name="Concept-2-Aftellen">
      <Composition
        id="BB-Countdown-Reel"
        component={CountdownAd}
        schema={countdownSchema}
        defaultProps={defaultCountdownProps}
        calculateMetadata={countdownMetadata}
        durationInFrames={countdownTotal(defaultCountdownProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-Countdown-Feed"
        component={CountdownAd}
        schema={countdownSchema}
        defaultProps={defaultCountdownProps}
        calculateMetadata={countdownMetadata}
        durationInFrames={countdownTotal(defaultCountdownProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>

    {/* Concept 3 · "Jij kiest wat Buddy ziet." (CONCEPT-3.md) */}
    <Folder name="Concept-3-Privacy">
      <Composition
        id="BB-Privacy-Reel"
        component={PrivacyAd}
        schema={privacySchema}
        defaultProps={defaultPrivacyProps}
        calculateMetadata={privacyMetadata}
        durationInFrames={privacyTotal(defaultPrivacyProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-Privacy-Feed"
        component={PrivacyAd}
        schema={privacySchema}
        defaultProps={defaultPrivacyProps}
        calculateMetadata={privacyMetadata}
        durationInFrames={privacyTotal(defaultPrivacyProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>
  </>
);
