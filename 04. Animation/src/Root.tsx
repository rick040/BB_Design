import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { Ad } from "./Ad";
import { BoemerangAd } from "./boemerang/BoemerangAd";
import { boemerangSchema, defaultBoemerangProps, TOTAL_FRAMES as BOEMERANG_TOTAL } from "./boemerang/schema";
import { CountdownAd } from "./countdown/CountdownAd";
import {
  type CountdownProps,
  countdownSchema,
  countdownTotal,
  defaultCountdownProps,
} from "./countdown/schema";
import { SleutelAd } from "./sleutel/SleutelAd";
import { defaultSleutelProps, sleutelSchema, TOTAL_FRAMES as SLEUTEL_TOTAL } from "./sleutel/schema";
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

    {/* Concept 62 · "Nu komt hij op tijd terug." (CONCEPT-62.md) · Reel met stem */}
    <Folder name="Concept-62-Boemerang">
      <Composition
        id="BB-Boemerang-Reel"
        component={BoemerangAd}
        schema={boemerangSchema}
        defaultProps={defaultBoemerangProps}
        durationInFrames={BOEMERANG_TOTAL}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </Folder>

    {/* Concept 72 · "Geen sleutel nodig." (CONCEPT-72.md) · Reel en Feed met stem */}
    <Folder name="Concept-72-Sleutel">
      <Composition
        id="BB-Sleutel-Reel"
        component={SleutelAd}
        schema={sleutelSchema}
        defaultProps={defaultSleutelProps}
        durationInFrames={SLEUTEL_TOTAL}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-Sleutel-Feed"
        component={SleutelAd}
        schema={sleutelSchema}
        defaultProps={defaultSleutelProps}
        durationInFrames={SLEUTEL_TOTAL}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>
  </>
);
