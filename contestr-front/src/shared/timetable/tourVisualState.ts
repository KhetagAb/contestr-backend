import type { TimelineSegment } from "@/client/types.gen";

export type TourVisualState = "past" | "active" | "next" | "starting" | "future";

export const TOUR_VISUAL_BG: Record<TourVisualState, string> = {
    past: "var(--success-border)",
    active: "var(--success-bg)",
    next: "var(--bg-sunken)",
    starting: "var(--bg-sunken)",
    future: "var(--bg-sunken)",
};

export function resolveSegmentVisualState(segment: TimelineSegment): TourVisualState {
    if (segment.status === "past") {
        return "past";
    }
    if (segment.status === "active") {
        return "active";
    }
    if (segment.status === "next") {
        return "next";
    }
    if (segment.status === "starting") {
        return "starting";
    }
    return "future";
}

export function visualStateClass(state: TourVisualState): string {
    return `tt-visual--${state}`;
}
