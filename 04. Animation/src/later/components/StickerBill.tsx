import React from "react";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import type { LaterProps } from "../schema";
import { STICKER_H, STICKER_POS, STICKER_W, Sticker } from "./Parcel";

/**
 * The bill with the yellow "Betaal later" sticker over its due chip.
 * `sticker` = null hides it (peeled off). `badge` 0..1 pops a red "?" on it.
 */
export const StickerBill: React.FC<{
  bill: LaterProps["bill"];
  showSticker?: boolean;
  badge?: number;
  stamp?: string;
  stampIn?: number;
  tick?: number;
  urgent?: boolean;
  dueOverride?: string;
}> = ({ bill, showSticker = true, badge = 0, stamp, stampIn, tick, urgent, dueOverride }) => (
  <div style={{ position: "relative", width: BILL_W, height: BILL_H }}>
    <BillCard
      sender={bill.sender}
      subject={bill.subject}
      amount={bill.amount}
      dueLabel={dueOverride ?? bill.due}
      stamp={stamp}
      stampIn={stampIn}
      tick={tick}
      urgent={urgent}
    />
    {showSticker ? (
      <div style={{ position: "absolute", left: STICKER_POS.left, bottom: STICKER_POS.bottom, transform: "rotate(-2deg)" }}>
        <Sticker text={bill.sticker} />
        {badge > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: STICKER_W - 60,
              top: -60,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "#ff5a79",
              color: "#fff",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 84,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${badge})`,
            }}
          >
            ?
          </div>
        ) : null}
      </div>
    ) : null}
  </div>
);

export { STICKER_H, STICKER_W };
