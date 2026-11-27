import React from "react";
import { type CalculateMetadataFunction, Composition, Folder } from "remotion";
import { Ad } from "./Ad";
import { AchterafAd } from "./achteraf-bf/AchterafAd";
import {
  type AchterafProps,
  achterafSchema,
  achterafTotal,
  defaultAchterafProps,
} from "./achteraf-bf/schema";
import { BoemerangAd } from "./boemerang/BoemerangAd";
import { boemerangSchema, defaultBoemerangProps, TOTAL_FRAMES as BOEMERANG_TOTAL } from "./boemerang/schema";
import { CountdownAd } from "./countdown/CountdownAd";
import {
  type CountdownProps,
  countdownSchema,
  countdownTotal,
  defaultCountdownProps,
} from "./countdown/schema";
import { TwaalfAd } from "./twaalf-52/TwaalfAd";
import { defaultTwaalfProps, type TwaalfProps, twaalfSchema, twaalfTotal } from "./twaalf-52/schema";
import { EigenHuisAd } from "./eigen-huis/EigenHuisAd";
import {
  defaultEigenHuisProps,
  type EigenHuisProps,
  eigenHuisSchema,
  eigenHuisTotal,
} from "./eigen-huis/schema";
import { ZoWerktAd } from "./zo-werkt-het/ZoWerktAd";
import { defaultZoWerktProps, type ZoWerktProps, zoWerktSchema, zoWerktTotal } from "./zo-werkt-het/schema";
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

const achterafMetadata: CalculateMetadataFunction<AchterafProps> = ({ props }) => ({
  durationInFrames: achterafTotal(props.timing),
});

const twaalfMetadata: CalculateMetadataFunction<TwaalfProps> = ({ props }) => ({
  durationInFrames: twaalfTotal(props.timing),
});

const eigenHuisMetadata: CalculateMetadataFunction<EigenHuisProps> = ({ props }) => ({
  durationInFrames: eigenHuisTotal(props.timing),
});

const zoWerktMetadata: CalculateMetadataFunction<ZoWerktProps> = ({ props }) => ({
  durationInFrames: zoWerktTotal(props.timing),
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

    {/* Meta-campagne 2612 · K1 "Eén dag gekocht, negen dagen betalen" (CONCEPT-K1.md) */}
    <Folder name="Campagne2612-K1-Achteraf">
      <Composition
        id="BB-K1Achteraf-Reel"
        component={AchterafAd}
        schema={achterafSchema}
        defaultProps={defaultAchterafProps}
        calculateMetadata={achterafMetadata}
        durationInFrames={achterafTotal(defaultAchterafProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-K1Achteraf-Feed"
        component={AchterafAd}
        schema={achterafSchema}
        defaultProps={defaultAchterafProps}
        calculateMetadata={achterafMetadata}
        durationInFrames={achterafTotal(defaultAchterafProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>

    {/* Meta-campagne 2612 · K2 "Twaalf wordt tweeënvijftig" (CONCEPT-K2.md) */}
    <Folder name="Campagne2612-K2-Twaalf">
      <Composition
        id="BB-K2Twaalf-Reel"
        component={TwaalfAd}
        schema={twaalfSchema}
        defaultProps={defaultTwaalfProps}
        calculateMetadata={twaalfMetadata}
        durationInFrames={twaalfTotal(defaultTwaalfProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-K2Twaalf-Feed"
        component={TwaalfAd}
        schema={twaalfSchema}
        defaultProps={defaultTwaalfProps}
        calculateMetadata={twaalfMetadata}
        durationInFrames={twaalfTotal(defaultTwaalfProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>

    {/* Meta-campagne 2612 · K3 "Eén huurcontract, zeven rekeningen" (CONCEPT-K3.md) */}
    <Folder name="Campagne2612-K3-EigenHuis">
      <Composition
        id="BB-K3EigenHuis-Reel"
        component={EigenHuisAd}
        schema={eigenHuisSchema}
        defaultProps={defaultEigenHuisProps}
        calculateMetadata={eigenHuisMetadata}
        durationInFrames={eigenHuisTotal(defaultEigenHuisProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-K3EigenHuis-Feed"
        component={EigenHuisAd}
        schema={eigenHuisSchema}
        defaultProps={defaultEigenHuisProps}
        calculateMetadata={eigenHuisMetadata}
        durationInFrames={eigenHuisTotal(defaultEigenHuisProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>

    {/* Meta-campagne 2612 · W1 "Zo werkt het" (CONCEPT-W1.md) */}
    <Folder name="Campagne2612-W1-ZoWerktHet">
      <Composition
        id="BB-W1ZoWerkt-Reel"
        component={ZoWerktAd}
        schema={zoWerktSchema}
        defaultProps={defaultZoWerktProps}
        calculateMetadata={zoWerktMetadata}
        durationInFrames={zoWerktTotal(defaultZoWerktProps.timing)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="BB-W1ZoWerkt-Feed"
        component={ZoWerktAd}
        schema={zoWerktSchema}
        defaultProps={defaultZoWerktProps}
        calculateMetadata={zoWerktMetadata}
        durationInFrames={zoWerktTotal(defaultZoWerktProps.timing)}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>
  </>
);
