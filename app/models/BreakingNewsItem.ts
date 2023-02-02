export interface BreakingNewsItem {
    id: string;
    headline?: string;
    effective_date: Date;
    body: string;
    priority: string;
    expiration_date: Date;
}
