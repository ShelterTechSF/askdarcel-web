import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceGuideIFrame, ResourceGuidesData } from './layout';
import styles from './ResourceGuides.module.scss';
import Footer from '../../components/ui/Footer/Footer';

export const ResourceGuide = () => {
  const { id } = useParams<{ id: string }>();
  const guide = useMemo(() => ResourceGuidesData.find(g => g.id === id) || null, [id])

  return (
    <>
      <div className={styles.resourceWrapper}>
        { !guide && <p>Cannot find a guide named {id}</p> }
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
};
