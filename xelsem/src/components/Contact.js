import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';
export const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
    .sendForm(process.env.REACT_APP_EMAILJS_SERVICE_ID, process.env.REACT_APP_EMAILJS_TEMPLATE_ID, form.current, {
        publicKey:  process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          window.alert('SUCCESS!');
        },
        (error) => {
            window.alert('FAILED...', error.text);
        },
      );
  };

  return ( 
    <div class="contact-form">
    <h2> Contact us</h2>
    
    <form ref={form} onSubmit={sendEmail}>
    <label>Name</label>
    <input type="text" name="name"  placeholder="Your Name" required />
    <label>Email</label>
    <input type="email" name="email" placeholder="Your Email" required/>
    <label>Message</label>
    <textarea name="message" placeholder="Your Message" required/>
    <input name="button"type="submit" value="Send" />
  </form>
  </div>
  );
};
export default Contact;
