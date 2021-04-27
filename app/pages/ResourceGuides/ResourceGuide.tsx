import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceGuideModel, ResourceGuideIFrame, ResourceGuidesData } from './layout';
import styles from './ResourceGuides.module.scss';
import Footer from '../../components/ui/Footer/Footer';

export const ResourceGuide = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<ResourceGuideModel|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const g = ResourceGuidesData.find(g => g.id === id);
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
