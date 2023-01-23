import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'components/ui';

export const PDF = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfSource, setPdfSource] = useState('');

  useEffect(() => {
    fetch(`/api/services/url_to_pdf`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({url: `http://dcnav.sfserviceguide.org/services/${id}`}),
      headers: { 'Content-Type': 'application/json' }
    }).then(resp => resp.blob()).then(blob => {
      setPdfSource(window.URL.createObjectURL(blob));
    });
  }, [id]);

  if (pdfSource === '') return <Loader />;

  return (
    <div className="find-page">
      <embed
        src={pdfSource}
        type="application/pdf"
        height="100%"
        width="100%"
        style={{ height: '95vh' }}
      />
    </div>
  );
};
