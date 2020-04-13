import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Footer from '../../components/ui/Footer/Footer';

import SimpleGuide from './components/SimpleGuide';


const CovidGuides = () => {
  const { path } = useRouteMatch();
  return (
    <div className="covid-guide-page">
      <Switch>
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
      </Switch>
      <Footer />
    </div>
  );
};

export default CovidGuides;
