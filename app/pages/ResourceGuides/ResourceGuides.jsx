import React from 'react';
import { Link } from 'react-router-dom';
import { ResourceGuidesData } from './layout';
import styles from './ResourceGuides.module.scss';
import Footer from '../../components/ui/Footer/Footer';

export const ResourceGuides = () => (
  <>
    <div className={styles.resourceWrapper}>
      <h1>Resource Guides</h1>

      <ul>
        { ResourceGuidesData.map(guide => (
          <li>
            <Link to={`/resource_guides/${guide.id}`}>{guide.name}</Link>
          </li>
        )) }
      </ul>

    </div>
    <Footer />
  </>
);
