// src/utils/attributeUtils.ts

/**
 * Returns a CSS class string based on the attribute value for color-coding.
 * @param value The player attribute value (1-20).
 * @returns A string containing CSS classes for color and font weight.
 */
export const getAttributeColorClass = (value: number): string => {
    if (value >= 20) return 'attr-godly font-black';
    if (value >= 19) return 'attr-superb font-bold';
    if (value >= 16) return 'attr-excellent font-bold';
    if (value >= 11) return 'attr-good';
    if (value >= 6) return 'attr-average';
    return 'attr-poor';
};

/**
 * Calculates the display string for a potentially partially scouted attribute.
 * Per the latest request, this now always shows a single, concrete number.
 * The "fog of war" is handled by the UI (e.g., color-coding) rather than showing a range.
 * @param value The true attribute value.
 * @param knowledge The scouting knowledge percentage (0-100).
 * @returns An object containing the display string (e.g., "15").
 */
export const getScoutedAttributeDisplay = (value: number, knowledge: number): { display: string, uncertainty: number } => {
    // If knowledge is very low, we can still opt to show nothing.
    if (knowledge < 10) {
        return { display: '?', uncertainty: 1 };
    }
    // Otherwise, show the actual rounded value.
    return { display: String(Math.round(value)), uncertainty: 0 };
};