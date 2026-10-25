import type { ReactNode } from "react";
import { CalendarClock, Coffee } from "lucide-react";
import type { TimetableView } from "@/client/types.gen";
import { derivePhaseDisplay } from "@/shared/timetable/phaseState";
import { MiniTimeline } from "@/shared/timetable/MiniTimeline";
import { formatCountdown } from "@/shared/timetable/segmentTime";
import { TourStatusIcon } from "@/shared/timetable/TourStatusIcon";
import {
    resolveSegmentVisualState,
    TOUR_VISUAL_BG,
} from "@/shared/timetable/tourVisualState";
import { useContestElapsed } from "@/shared/timetable/useContestElapsed";
import styles from "./ContestPhaseStrip.module.css";

export type ContestPhaseDisplayVariant = "strip" | "focus";

type Props = {
    view: TimetableView;
    variant?: ContestPhaseDisplayVariant;
    onOpenFocusPage?: () => void;
};

const HERO_ICON_PX = { strip: 18, focus: 32 } as const;

function PhaseCard({
    className,
    clickable,
    ariaLabel,
    onOpenFocusPage,
    children,
}: {
    className: string;
    clickable: boolean;
    ariaLabel: string;
    onOpenFocusPage?: () => void;
    children: ReactNode;
}) {
    if (!clickable || !onOpenFocusPage) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            role="link"
            tabIndex={0}
            className={`${className} ${styles.phaseCardClickable}`}
            aria-label={ariaLabel}
            onClick={onOpenFocusPage}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenFocusPage();
                }
            }}
        >
            {children}
        </div>
    );
}

export function ContestPhaseDisplay({
    view,
    variant = "strip",
    onOpenFocusPage,
}: Props) {
    const elapsed = useContestElapsed(
        view.contest_start_time,
        view.elapsed_seconds ?? 0,
    );
    const phase = derivePhaseDisplay(view, elapsed);
    const segments = view.timeline_segments ?? [];
    const heroVisual = phase.heroSegment
        ? resolveSegmentVisualState(phase.heroSegment)
        : "future";
    const heroBg = phase.heroSegment ? TOUR_VISUAL_BG[heroVisual] : "var(--bg-sunken)";
    const heroIconPx = HERO_ICON_PX[variant];
    const clickable = variant === "strip" && !!onOpenFocusPage;

    const timerText =
        phase.remainingSeconds != null
            ? formatCountdown(phase.remainingSeconds)
            : null;

    const rowClass =
        variant === "focus"
            ? `${styles.phaseRow} ${styles.phaseRowFocus}`
            : styles.phaseRow;

    return (
        <div className={rowClass} aria-live="polite">
            <PhaseCard
                className={styles.currentTourCard}
                clickable={clickable}
                ariaLabel="Открыть расписание тура крупно"
                onOpenFocusPage={onOpenFocusPage}
            >
                {phase.empty ? (
                    <div className={styles.currentTourEmpty}>
                        <CalendarClock
                            size={variant === "focus" ? 28 : 20}
                            className={styles.emptyIcon}
                            aria-hidden
                        />
                        <span className={styles.emptyText}>{phase.heroLabel}</span>
                    </div>
                ) : (
                    <div className={styles.currentTourBody}>
                        <span
                            className={styles.heroChip}
                            style={{ backgroundColor: heroBg }}
                        >
                            {phase.isPause ? (
                                <Coffee
                                    size={heroIconPx}
                                    strokeWidth={2}
                                    className={styles.heroPauseIcon}
                                    data-size={variant}
                                    aria-hidden
                                />
                            ) : phase.heroSegment ? (
                                <span
                                    className={styles.heroIcon}
                                    style={
                                        variant === "focus"
                                            ? {
                                                  ["--tt-icon-slot-size" as string]: `${heroIconPx}px`,
                                              }
                                            : undefined
                                    }
                                >
                                    <TourStatusIcon
                                        status={phase.heroSegment.status}
                                        visualState={heroVisual}
                                        size={heroIconPx}
                                    />
                                </span>
                            ) : null}
                            <span className={styles.heroLabel}>{phase.heroLabel}</span>
                        </span>

                        {phase.statusText || timerText ? (
                            <div className={styles.currentTourMeta}>
                                {phase.statusText ? (
                                    <span className={styles.statusText}>
                                        {phase.statusText}
                                    </span>
                                ) : null}
                                {timerText ? (
                                    <span
                                        className={styles.timer}
                                        aria-label="Оставшееся время"
                                    >
                                        {timerText}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                )}
            </PhaseCard>

            {segments.length > 0 ? (
                <PhaseCard
                    className={styles.toursListCard}
                    clickable={clickable}
                    ariaLabel="Открыть список туров крупно"
                    onOpenFocusPage={onOpenFocusPage}
                >
                    <p className={styles.toursListTitle}>Список туров</p>
                    <div
                        className={
                            variant === "focus" ? styles.toursListTimelineWrap : undefined
                        }
                    >
                        <MiniTimeline
                            segments={segments}
                            elapsed={elapsed}
                            size={variant === "focus" ? "large" : "default"}
                            fitWidth={variant === "focus"}
                        />
                    </div>
                </PhaseCard>
            ) : null}
        </div>
    );
}
