
/**
 * Utility to check if a product is "New" based on its creation date.
 * @param createdAt - The creation date of the product (string or Date).
 * @param thresholdDays - The number of days a product is considered new (default: 7).
 * @returns boolean
 */
export function isProductNew(createdAt: string | Date | undefined, thresholdDays: number = 7): boolean {
    if (!createdAt) return false;

    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const diffInMs = currentDate.getTime() - createdDate.getTime();
    
    // Convert difference to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    return diffInDays <= thresholdDays;
}
