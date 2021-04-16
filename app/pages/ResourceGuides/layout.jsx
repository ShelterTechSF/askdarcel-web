import React from 'react';
import { last } from 'lodash';
import styles from './ResourceGuides.module.scss';

import EvictionGuideSpanish from '../../assets/guides/edc-guide-032021-spanish.pdf';
import EvictionGuideEnglish from '../../assets/guides/edc-guide-032021.pdf';

export const ResourceGuidesData = [
  { name: 'Eviction Prevention Guide (Espanol)', path: EvictionGuideSpanish },
  { name: 'Eviction Prevention Guide (English)', path: EvictionGuideEnglish },
].map(({ name, path }) => ({
  name,
  path,
  id: last(path.split('/')).replace('.pdf', ''),
}));

export const ResourceGuidesLookup = {
  'Eviction Prevention Guide (Espanol)': EvictionGuideSpanish,
  'Eviction Prevention Guide (English)': EvictionGuideEnglish,
};

export const ResourceGuideIFrame = ({ path, title }) => <iframe className={styles.resourceFrame} title={title} src={path} height="100%" />;
