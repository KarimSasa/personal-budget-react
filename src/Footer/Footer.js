import React from 'react';

function Footer() {
    return (
        //This is a Semantic HTML Change: Removed unnecessary div, and replaced it with footer with the center class
        //This is also an A11y Change: Added role="contentinfo" for better screen reader support 
       <footer className="center" role="contentinfo">
           All rights reserved &copy; Fabio Nolasco
       </footer> 
    );
  }
  
  export default Footer;
  