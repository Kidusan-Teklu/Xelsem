// src/components/About.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFacebookF, 
    faTwitter, 
    faInstagram, 
    faLinkedinIn, 
    faGithub 
} from '@fortawesome/free-brands-svg-icons';
import './About.css'; // Importing the CSS file for the About component

const About = () => {
    return (
        <div className="about">
            <h2>About XelsemBooks</h2>
            <p>
                XelsemBooks is a digital platform designed to bring together book lovers from all over the world. 
                Our mission is to provide an easy-to-use and accessible space where users can upload, read, and 
                share their favorite books with a community of like-minded individuals.
            </p>
            <p>
                Whether you're a casual reader or a book enthusiast, XelsemBooks has something for everyone. 
                Join us today and dive into the world of books!
            </p>

            <div className="social-media-container">
                <a 
                    href="https://web.facebook.com/kedusan.teklu " 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon facebook"
                >
                    <FontAwesomeIcon icon={faFacebookF} />
                </a>
                
                <a 
                    href="https://x.com/KidusanTek71828 
" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon twitter"
                >
                    <FontAwesomeIcon icon={faTwitter} />
                </a>
                
                <a 
                    href="https://www.instagram.com/kidus_dt/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon instagram"
                >
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                
                <a 
                    href="https://www.linkedin.com/in/kidusan-teklu/" 
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
        </div>
    );
};

export default About;
