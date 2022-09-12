import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import qs from 'qs';
import ReactGA from 'react-ga';

import { Checkbox } from 'components/ui/inline/Checkbox/Checkbox';
import { Button } from 'components/ui/inline/Button/Button';
import { Section } from 'components/ucsf/Section/Section';
import { Layout } from 'components/ucsf/Layout/Layout';

import { constants } from './constants';
import styles from './UcsfServiceTypePage.module.scss';

import { useSubcategoriesForCategory } from '../../hooks/APIHooks';

interface SubcategoryRefinement {
  name: string;
  id: number;
}

interface SelectedSubcategories {
  [key: number]: boolean;
}

const ServiceTypes = ({ subcategories, selectedSubcategories, setSelectedSubcategories }: {
  subcategories: SubcategoryRefinement[];
  selectedSubcategories: SelectedSubcategories;
  setSelectedSubcategories: (categories: SelectedSubcategories) => void;
}) => {
  const handleSubcategoryClick = (targetSubcategoryId: number) => {
    const seeAllIsTarget = targetSubcategoryId === -1;
    const targetValue = !selectedSubcategories[targetSubcategoryId];
    if (seeAllIsTarget) {
      // Check or uncheck all boxes in accordance with "See all" checked value
      massUpdateSelectedSubcategories(targetValue);
    } else {
      const updatedSubcategories = {
        ...selectedSubcategories,
        [targetSubcategoryId]: targetValue,
      };

      // If target checked value is false, uncheck "See all" box as well
      if (!targetValue) {
        updatedSubcategories[-1] = false;
      }

      setSelectedSubcategories(updatedSubcategories);
    }
  };

  const massUpdateSelectedSubcategories = (targetValue: boolean) => {
    const massUpdatedSubcategories: SelectedSubcategories = {};
    subcategories.forEach(category => {
      massUpdatedSubcategories[category.id] = targetValue;
    });

    setSelectedSubcategories(massUpdatedSubcategories);
  };

  return (
    <div className={styles.serviceTypeBox}>
      <div className={styles.serviceTypeBox_title}>Service Type</div>

      <ul className={styles.serviceTypeList}>
        {subcategories.map(item => (
          <li key={item.name} className={styles.serviceTypeGroup}>
            <Checkbox
              onChange={() => handleSubcategoryClick(item.id)}
              name="serviceTypes"
              id={item.name}
              checked={selectedSubcategories[item.id] || false}
            />
            <label className={styles.serviceTypeLabel} htmlFor={item.name}>
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Page = () => {
  const [selectedSubcategories, setSelectedSubcategories] = useState<SelectedSubcategories>({});
  interface LocationState {
    selectedResourceSlug: string;
  }

  const history = useHistory<LocationState>();
  const { state } = history.location;
  const selectedResourceSlug = state && state.selectedResourceSlug;

  const goToResourceResults = (slug: string) => {
    const searchState = {
      refinementList: {
        categories: subcategories
          .filter(c => selectedSubcategories[c.id])
          .map(c => c.name),
      },
    };

    const categoriesRefinements = searchState.refinementList.categories.join('; ') || 'NONE';
    const search = qs.stringify(searchState, { encodeValuesOnly: true });

    // Todo add eligibilities refinements to tracking
    ReactGA.event({
      category: 'UCSF Resource Inquiry',
      action: 'Refined UCSF Resource Inquiry',
      label: `${slug} Inquiry | Category Refinements: ${categoriesRefinements}`,
    });

    history.push(`/${slug}/results?search=${search}`);
  };

  const backToEligibilityPage = (slug: string) => {
    history.push('/client-identity', { selectedResourceSlug: slug });
  };

  if (!selectedResourceSlug) {
    history.push('/');
    return null;
  }

  const subcategories: SubcategoryRefinement[] = useSubcategoriesForCategory(
    constants[selectedResourceSlug].id,
  ) || [];

  // Add generic "See all" element to subcategory array if it is not there yet
  if (subcategories.length > 0 && subcategories[0].id !== -1) {
    subcategories.unshift({ id: -1, name: 'See all' });
  }

  return (
    <div className={styles.serviceTypePage}>
      <Section
        addClass={styles.subtitleMargin}
        subtitle="Step 3: Can you tell us more about the services that your client is looking for?"
      />
      <div className={styles.serviceTypeContainer}>
        <ServiceTypes
          subcategories={subcategories}
          selectedSubcategories={selectedSubcategories}
          setSelectedSubcategories={setSelectedSubcategories}
        />
        <div className={styles.serviceTypeBtns}>
          <Button
            onClick={() => { backToEligibilityPage(selectedResourceSlug); }}
          >
            Back
          </Button>
          <Button
            onClick={() => { goToResourceResults(selectedResourceSlug); }}
            addClass={styles.goToResultsBtn}
          >
            Next: Service Capacity
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UcsfServiceTypePage = () => (
  <Layout>
    <Page />
  </Layout>
);
