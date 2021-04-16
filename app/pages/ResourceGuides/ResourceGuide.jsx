import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceGuideIFrame, ResourceGuidesData } from './layout';
import styles from './ResourceGuides.module.scss';
import Footer from '../../components/ui/Footer/Footer';

export const ResourceGuide = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  // const items = useMemo(() => Object.entries(ResourceGuidesLookup), []);

  useEffect(() => {
    const g = ResourceGuidesData.find(g => g.id === id);
    console.log('we have a guide', id, g);
    if (g) {
      setGuide(g);
    }
    setLoading(false);
  }, [id]);

  return (
    <>
      <div className={styles.resourceWrapper}>

        { loading && <p>Loading!</p> }

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
