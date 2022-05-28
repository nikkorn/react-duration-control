/**
 * Returns the given value clamped to the range defined by min and max inclusively.
 * @param value The value to clamp.
 * @param min The min value, or lower bound.
 * @param max The max value, or upper bound.
 * @returns The given value clamped to the range defined by min and max inclusively.
 */
export function clamp(
    value: number | null,
    min: number,
    max: number
): number | null {
    if (value === null) {
        // The value was null, so just return null.
        return null;
    } else if (value > max) {
        // The value was greater than the upper bound so just return the upper bound.
        return max;
    } else if (value < min) {
        // The value was lower than the lower bound so just return the lower bound.
        return min;
    } else {
        // The value was already between the upper and lower  bounds so just return it.
        return value;
    }
}
