import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Footer from '../../components/ui/Footer/Footer';

import FoodList from './components/FoodList';
import FoodMap from './components/FoodMap';
import SimpleGuide from './components/SimpleGuide';
import styles from './Covid.scss';


const CovidRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <SimpleGuide
          pageHeader="Coronavirus resources for Individuals-In-Need"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vTGpgLJDTg3sm2XhyBoNUTNUhqJjTt5lEp8IXSP_yBNrxVgZ_zkmdKPo7JcKJTbduoTRt_dYnRV9xTB/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/domesticviolence`}>
        <SimpleGuide
          pageHeader="Domestic Violence help for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vSGs3HcU1JNl6eCvQrQAy9kcbgLoZW9KUU2-IXE6chcOTvs_aV_PuzwH9A5QWeZ8lO-u1qAwzdqQrID/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/financialassistance`}>
        <SimpleGuide
          pageHeader="Financial and Job Assistance for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vQ76IDYnl7rpCdyCf1Jk6cbxO240gzaVmUAWUMNi8nAyTgqrbJKxDK0bv1QWHNcNBQ79cUHq_NvBJko/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/foodlist`}>
        <FoodList />
      </Route>
      <Route path={`${path}/foodmap`}>
        <FoodMap />
      </Route>
      <Route path={`${path}/hygiene`}>
        <SimpleGuide
          pageHeader="Hygiene resources for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vSsqCdzEf9ulqX64cSvWiq-T877DLvhNZ9jXjepMT51M6qYqqKbGg1pObo2GnuWELTv5_jzfYi2ZbEH/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/internet`}>
        <SimpleGuide
          pageHeader="Internet Access during the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vTmf5Z0RiprdHr5r0Xw-1JMHF-YgOcDCSYxKaVtgqbKbSfnOmUG8140FIMwBtI4BgpqYjQ2SivnBLku/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/lgbtq`}>
        <SimpleGuide
          pageHeader="LGBTQ Youth resouces for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vRW7qcXDy9f9djBeESvo9vRMLGJ0ff9r2a9BzKFBr_rGgQwmgj9bRFfjB_w83Ly92k4ddAVHZGZ33TB/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/medicalservices`}>
        <SimpleGuide
          pageHeader="Medical Services for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vSqkfARenUcIZRff8NHBtIhIdyWoqEcdtMyN1KvsCFoTlgFoQ_zj_tSBesQWxqoAsBP4iqCcbACN8-j/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/rentalassistance`}>
        <SimpleGuide
          pageHeader="Rental Assistance for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vQrdPtbc6EKPs8X81xu2X8bu8LC-ke2jBEiENImAoLUiSWoOMIRqa1hlneiiCoGDBBOwyR9RHVKlrJe/pub?embedded=false"
        />
      </Route>
      <Route path={`${path}/shelteraccess`}>
        <SimpleGuide
          pageHeader="Shelter Access Points for the COVID-19 Emergency"
          googleDocURL="https://docs.google.com/document/d/e/2PACX-1vTFNbKZUYxKBW9qX-gDWOTKHrO7enuIK4OuymWGJxQ1ypELhqo6BvQV8Gg4E_QtpuEMvHlzY6e058so/pub?embedded=false"
        />
      </Route>
    </Switch>
  );
};

const CovidPages = () => (
  <React.Fragment>
    <div className={styles.page}>
      <CovidRoutes />
    </div>
    <Footer />
  </React.Fragment>
);

export default CovidPages;
