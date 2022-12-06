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

const seeAllPseudoId = -1;

const ServiceTypes = ({ subcategories, selectedSubcategories, setSelectedSubcategories }: {
  subcategories: SubcategoryRefinement[];
  selectedSubcategories: SelectedSubcategories;
  setSelectedSubcategories: (categories: SelectedSubcategories) => void;
}) => {
  const handleSubcategoryClick = (targetSubcategoryId: number) => {
    const seeAllIsTargetElement = targetSubcategoryId === seeAllPseudoId;
    const newValue = !selectedSubcategories[targetSubcategoryId];
    const updatedSubcategories = { ...selectedSubcategories };

    if (newValue) {
      if (seeAllIsTargetElement) {
        // If "See All" is target refinement, deselect all other subcategories. This is done because
        // showing all services requires that we do not include any refinements in our query
        subcategories.forEach(category => {
          updatedSubcategories[category.id] = false;
        });
      } else {
        // If new refinement will be checked, uncheck "See All" box since now the query will include
        // refinements
        updatedSubcategories[seeAllPseudoId] = false;
      }
    }

    setSelectedSubcategories({ ...updatedSubcategories, [targetSubcategoryId]: newValue });
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
    selectedEligibilityNames: string[];
  }

  const history = useHistory<LocationState>();
  const { state } = history.location;
  const selectedResourceSlug = state && state.selectedResourceSlug;
  const selectedEligibilities = state && state.selectedEligibilityNames;

  const goToResourceResults = (slug: string) => {
    const searchState = {
      refinementList: {
        eligibilities: selectedEligibilities,
        categories: subcategories.flatMap(c => {
          const isSeeAllItem = c.id === seeAllPseudoId;
          if (!isSeeAllItem && selectedSubcategories[c.id]) {
            return c.name;
          }
          return [];
        }),
      },
    };

    const categoriesRefinements = searchState.refinementList.categories.join('; ') || 'NONE';
    const eligibilitiesRefinements = searchState.refinementList.eligibilities.join('; ') || 'NONE';
    const search = qs.stringify(searchState, { encodeValuesOnly: true });

    ReactGA.event({
      category: 'UCSF Resource Inquiry',
      action: 'Refined UCSF Resource Inquiry',
      label: `${slug} Inquiry | Category Refinements: ${categoriesRefinements} | Eligibility Refinements: ${eligibilitiesRefinements}`,
    });

    history.push(`/${slug}/results?${search}`);
  };

  const backToEligibilityPage = (slug: string) => {
    history.push('/client-identity', { selectedResourceSlug: slug, selectedEligibilityNames: [] });
  };

  if (!selectedResourceSlug) {
    history.push('/');
    return null;
  }

  const subcategories: SubcategoryRefinement[] = useSubcategoriesForCategory(
    constants[selectedResourceSlug].id,
  ) || [];

  // Add generic "See All" element to subcategory array if it is not there yet
  if (!subcategories[0] || subcategories[0].id !== seeAllPseudoId) {
    subcategories.unshift({ id: seeAllPseudoId, name: 'See All' });
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
