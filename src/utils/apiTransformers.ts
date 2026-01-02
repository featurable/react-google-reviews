import { GoogleReview, GoogleReviewV2, FeaturableAPIResponseV1, FeaturableAPIResponseV2 } from '../types/review';

/**
 * Transforms a v2 GoogleReview into v1 format for backwards compatibility
 */
export function transformV2ReviewToV1(reviewV2: GoogleReviewV2): GoogleReview {
    return {
        reviewId: reviewV2.id,
        reviewer: {
            profilePhotoUrl: reviewV2.author?.photoUrl ?? '',
            displayName: reviewV2.author?.name ?? 'Anonymous',
            isAnonymous: !reviewV2.author?.name,
        },
        starRating: reviewV2.rating ? reviewV2.rating.value : 0,
        comment: reviewV2.text,
        createTime: reviewV2.createdAt,
        updateTime: reviewV2.publishedAt ?? null,
    };
}

/**
 * Transforms a v2 API response into v1 format for backwards compatibility
 */
export function transformV2ResponseToV1(responseV2: FeaturableAPIResponseV2): FeaturableAPIResponseV1 {
    if (!responseV2.success) {
        return { success: false };
    }

    return {
        success: true,
        profileUrl: responseV2.widget.gbpLocationSummary.writeAReviewUri,
        totalReviewCount: responseV2.widget.gbpLocationSummary.reviewsCount,
        averageRating: responseV2.widget.gbpLocationSummary.rating,
        reviews: responseV2.widget.reviews.map(transformV2ReviewToV1),
    };
}

/**
 * Type guard to check if response is v2
 */
export function isV2Response(
    response: FeaturableAPIResponseV1 | FeaturableAPIResponseV2
): response is FeaturableAPIResponseV2 {
    if (!response.success) return false;

    return 'widget' in response;
}
