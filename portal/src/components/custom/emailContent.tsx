import React from 'react';
import ShadowDOM from 'react-shadow';

const EmailContent = ({ content }:{content:string}) => {
  return (
    <ShadowDOM.div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </ShadowDOM.div>
  );
};

export default EmailContent;
