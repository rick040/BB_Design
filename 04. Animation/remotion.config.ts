import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// H.264 + yuv420p plays everywhere (Instagram, WhatsApp, QuickTime).
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
// Tag + convert as BT.709 limited range so the brand blue (#013BFF)
// looks the same on phones as in the Studio preview.
Config.setColorSpace("bt709");
Config.setCrf(16);
