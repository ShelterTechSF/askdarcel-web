import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from "./EmailSignup.module.scss";

/* 
TODO:
- Get working with recaptcha
- Add success message
- Add styles
*/

export const EmailSignup = () => {
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  const handleRecaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (recaptchaValue) {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      formData.append("g-recaptcha-response", recaptchaValue);

      fetch(form.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Form submitted successfully:", data);
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    } else {
      alert("Please complete the reCAPTCHA");
    }
  };

  return (
    <div className={styles.emailSignupContainer}>
      <div className={styles.emailForm}>
        <form
          action="https://app.e2ma.net/app2/audience/signup/1933232/1923816/?r=signup"
          method="post"
          id="emma_signup_form"
          acceptCharset="utf-8"
          target="emma_signup_iframe"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="subscriber_consent_email" value="false" />
          <input
            type="hidden"
            name="subscriber_consent_tracking"
            value="false"
          />
          <input type="hidden" name="checked_subscriptions" value="" />
          <input
            type="hidden"
            name="e2ma_field_enable_recaptcha"
            value="true"
          />
          <input
            id="emma-email"
            name="email"
            type="email"
            placeholder="Your email address"
            required
          />
          <ReCAPTCHA
            sitekey="6Lf_Ci8UAAAAANg6OUKu5Cp5W0N3crhYG-ktgikT"
            onChange={handleRecaptchaChange}
          />
          <button type="submit">Subscribe</button>
        </form>
        {/* TODO: test if this is necessary: */}
        <iframe
          style={{ display: "none" }}
          name="emma_signup_iframe"
          title="Emma Signup Iframe"
        />
      </div>
    </div>
  );
};
