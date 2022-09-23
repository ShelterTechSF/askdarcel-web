export interface BreakingNewsItem {
    id: string;
    headline?: string;
    effective_date: Date;
    body: string;
    priority: string;
    expiration_date: Date;
}

export const getBreakingNewsItems = async (): Promise<Array<BreakingNewsItem>> => Promise.resolve([{
  id: '~enc~1',
  headline: 'Fire under the bridge...',
  effective_date: new Date('09-19-2022'),
  body: `A fire broke out under the bridge near blah blah and blah blah.
Nearby residents are encouraged to stay away from the area.`,
  priority: '2',
  expiration_date: new Date('09-19-2023'),
}, {
  id: '~enc~2',
  headline: 'Water under the fridge...',
  effective_date: new Date('09-19-2022'),
  body: `Someone spilled a bucket full of ice and it melted.
Now there's water under the fridge...`,
  priority: '1',
  expiration_date: new Date('09-19-2023'),
}]);
