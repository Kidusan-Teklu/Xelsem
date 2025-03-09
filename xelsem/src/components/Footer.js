// src/components/Footer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFacebookF, 
    faTwitter, 
    faInstagram, 
    faLinkedinIn, 
    faGithub 
} from '@fortawesome/free-brands-svg-icons';
import './Footer.css'; // Importing the CSS file for the footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="social-media-footer">
                    <a 
                        href="https://web.facebook.com/kedusan.teklu" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon facebook"
                    >
                        <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    
                    <a 
                        href="https://x.com/KidusanTek71828" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon twitter"
                    >
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    
                    <a 
                        href="https://instagram.com/kidus_dt/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon instagram"
                    >
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    
                    <a 
                        href="https://linkedin.com/in/kidusan-teklu/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon linkedin"
                    >
                        <FontAwesomeIcon icon={faLinkedinIn} />
                    </a>
                    
                    <a 
                        href="https://github.com/Kidusan-Teklu/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="social-icon github"
                    >
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </div>
                <p>© 2024 XelsemBooks. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
