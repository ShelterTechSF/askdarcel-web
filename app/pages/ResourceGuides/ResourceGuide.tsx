import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './ResourceGuides.module.scss';
import { Footer } from '../../components/ui';
import { ResourceGuidesLookup } from './data';

export function ResourceGuide() {
  const { id } = useParams<{ id: string }>();
  const guide = ResourceGuidesLookup[id];
  // const guide = useMemo(() => ResourceGuidesData.find(g => g.id === id) || null, [id]);

  return (
    <>
      <div className={styles.resourceWrapper}>
        { !guide && (
        <p>
          Cannot find a guide named
          {id}
        </p>
        ) }
        { guide && (
        <div className={styles.resourceFrameWrapper}>
          <h1>{ guide.name }</h1>
          <ResourceGuideIFrame title={guide.name} path={guide.path} />
        </div>
        ) }
      </div>
      <Footer />
    </>
  );
}

export function ResourceGuideIFrame({ path, title }: { path: string; title: string }) {
  return <iframe className={styles.resourceFrame} title={title} src={path} height="100%" />;
}
