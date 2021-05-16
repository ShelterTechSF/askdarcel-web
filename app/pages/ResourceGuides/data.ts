import { last } from 'lodash';
import EvictionGuideSpanish from '../../assets/guides/edc-guide-032021-spanish.pdf';
import EvictionGuideEnglish from '../../assets/guides/edc-guide-032021.pdf';

export interface ResourceGuideModel {
  name: string
  path: string
  id: string
}

export const ResourceGuidesData: ResourceGuideModel[] = [
  { name: 'Eviction Prevention Guide (Espanol)', path: EvictionGuideSpanish },
  { name: 'Eviction Prevention Guide (English)', path: EvictionGuideEnglish },
].map(({ name, path }: { name: string, path: string }) => ({
  name,
  path,
  id: (last(path.split('/')) || '').replace('.pdf', ''),
}));

export const ResourceGuidesLookup: { [id: string]: ResourceGuideModel } = ResourceGuidesData.reduce(
  (lookup, data) => ({ ...lookup, [data.id]: data }),
  {},
);
