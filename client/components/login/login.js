/* eslint-disable camelcase */
import "./index.css";

import axios from "axios";
import PropTypes from "prop-types";
import qs from "qs";
import React from "react";
import {Link, Route} from "react-router-dom";

import {loginApiUrl} from "../../constants";
import getAssetPath from "../../utils/get-asset-path";
import getParameterByName from "../../utils/get-parameter-by-name";
import getText from "../../utils/get-text";
import renderAdditionalInfo from "../../utils/render-additional-info";
import Contact from "../contact-box";
import Modal from "../modal";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const username = getParameterByName("username");
    const token = getParameterByName("token");
    if (username && token) {
      this.setState(
        {
          username,
          password: token,
        },
        () => {
          this.handleSubmit();
        },
      );
    }
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    if (event) event.preventDefault();
    const {orgSlug, authenticate} = this.props;
    const {username, password, errors} = this.state;
    const url = loginApiUrl.replace("{orgSlug}", orgSlug);
    this.setState({
      errors: {},
    });
    return axios({
      method: "post",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      url,
      data: qs.stringify({
        username,
        password,
      }),
    })
      .then(() => {
        authenticate(true);
      })
      .catch(error => {
        const {data} = error.response;
        this.setState({
          errors: {
            ...errors,
            ...(data.non_field_errors
              ? {nonField: data.non_field_errors[0]}
              : {nonField: ""}),
            ...(data.detail ? {nonField: data.detail} : {}),
            ...(data.username ? {username: data.username} : {username: ""}),
            ...(data.password ? {password: data.password} : {password: ""}),
          },
        });
      });
  }

  render() {
    const {errors, username, password} = this.state;
    const {
      language,
      loginForm,
      orgSlug,
      termsAndConditions,
      privacyPolicy,
      match,
    } = this.props;
    const {
      links,
      buttons,
      input_fields,
      social_login,
      additional_info_text,
    } = loginForm;
    return (
      <React.Fragment>
        <div className="owisp-login-container">
          <div className="owisp-login-container-inner">
            <form className="owisp-login-form" onSubmit={this.handleSubmit}>
              {social_login ? (
                <>
                  {social_login.links.length ? (
                    <>
                      <div className="owisp-login-social-links-div">
                        {social_login.links.map(link => {
                          if (link.url)
                            return (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="owisp-login-social-link"
                                key={link.url}
                              >
                                <div>
                                  {link.icon ? (
                                    <img
                                      src={getAssetPath(orgSlug, link.icon)}
                                      alt={
                                        link.text
                                          ? getText(link.text, language)
                                          : link.url
                                      }
                                      className="owisp-login-social-link-icon"
                                    />
                                  ) : null}
                                  {link.text ? (
                                    <div className="owisp-login-social-link-text">
                                      {getText(link.text, language)}
                                    </div>
                                  ) : null}
                                </div>
                              </a>
                            );
                          return null;
                        })}
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}
              <div className="owisp-login-fieldset">
                {errors.nonField && (
                  <div className="owisp-login-error owisp-login-error-non-field">
                    <span className="owisp-login-error-icon">!</span>
                    <span className="owisp-login-error-text owisp-login-error-text-non-field">
                      {errors.nonField}
                    </span>
                  </div>
                )}
                {input_fields.username ? (
                  <>
                    <label
                      className="owisp-login-label owisp-login-label-username"
                      htmlFor="owisp-login-username"
                    >
                      <div className="owisp-login-label-text">
                        {getText(input_fields.username.label, language)}
                      </div>
                      <input
                        className={`owisp-login-input
                      owisp-login-input-username
                      ${errors.username ? "error" : ""}`}
                        type={input_fields.username.type}
                        id="owisp-login-username"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                        required
                        placeholder={getText(
                          input_fields.username.placeholder,
                          language,
                        )}
                        pattern={
                          input_fields.username.pattern
                            ? input_fields.username.pattern
                            : undefined
                        }
                        title={
                          input_fields.username.pattern_description
                            ? getText(
                                input_fields.username.pattern_description,
                                language,
                              )
                            : undefined
                        }
                      />
                    </label>
                    {errors.username && (
                      <div className="owisp-login-error owisp-login-error-username">
                        <span className="owisp-login-error-icon">!</span>
                        <span className="owisp-login-error-text owisp-login-error-text-username">
                          {errors.username}
                        </span>
                      </div>
                    )}
                  </>
                ) : null}
                {input_fields.password ? (
                  <>
                    <label
                      className="owisp-login-label owisp-login-label-password"
                      htmlFor="owisp-login-password"
                    >
                      <div className="owisp-login-label-text">
                        {getText(input_fields.password.label, language)}
                      </div>
                      <input
                        className={`owisp-login-input owisp-login-input-password
                      ${errors.password1 ? "error" : ""}`}
                        type={input_fields.password.type}
                        id="owisp-login-password"
                        required
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        placeholder={getText(
                          input_fields.password.placeholder,
                          language,
                        )}
                        pattern={
                          input_fields.password.pattern
                            ? input_fields.password.pattern
                            : undefined
                        }
                        title={
                          input_fields.password.pattern_description
                            ? getText(
                                input_fields.password.pattern_description,
                                language,
                              )
                            : undefined
                        }
                      />
                    </label>
                    {errors.password && (
                      <div className="owisp-login-error owisp-login-error-password">
                        <span className="owisp-login-error-icon">!</span>
                        <span className="owisp-login-error-text owisp-login-error-text-password">
                          {errors.password1}
                        </span>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
              {additional_info_text ? (
                <div className="owisp-login-add-info">
                  {renderAdditionalInfo(
                    additional_info_text,
                    language,
                    termsAndConditions,
                    privacyPolicy,
                    orgSlug,
                    "login",
                  )}
                </div>
              ) : null}
              {buttons.login ? (
                <>
                  {buttons.login.label ? (
                    <label
                      className="owisp-login-label owisp-login-label-login-btn"
                      htmlFor="owisp-login-login-btn"
                    >
                      <div className="owisp-login-label-text">
                        {getText(buttons.login.label, language)}
                      </div>
                    </label>
                  ) : null}
                  <input
                    type="submit"
                    className="owisp-login-form-btn owisp-login-login-btn"
                    id="owisp-login-login-btn"
                    value={getText(buttons.login.text, language)}
                  />
                </>
              ) : null}
              {buttons.login ? (
                <>
                  {buttons.register.label ? (
                    <label
                      className="owisp-login-label owisp-login-label-register-btn"
                      htmlFor="owisp-login-register-btn"
                    >
                      <div className="owisp-login-label-text">
                        {getText(buttons.register.label, language)}
                      </div>
                    </label>
                  ) : null}
                  <div className="owisp-login-form-register-btn-div">
                    <Link
                      to={`/${orgSlug}/registration`}
                      className="owisp-login-form-btn owisp-login-register-btn"
                    >
                      {getText(buttons.register.text, language)}
                    </Link>
                  </div>
                </>
              ) : null}
              {links ? (
                <div className="owisp-login-links-div">
                  {links.forget_password ? (
                    <Link
                      to={`/${orgSlug}/password/reset`}
                      className="owisp-login-link"
                    >
                      {getText(links.forget_password, language)}
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </form>
            <div className="owisp-login-contact-container">
              <Contact />
            </div>
          </div>
        </div>
        <Route
          path={`${match.path}/:name`}
          render={props => {
            return <Modal {...props} prevPath={match.url} />;
          }}
        />
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  loginForm: PropTypes.shape({
    social_login: PropTypes.shape({
      divider_text: PropTypes.object,
      description: PropTypes.object,
      links: PropTypes.arrayOf(PropTypes.object),
    }),
    input_fields: PropTypes.shape({
      username: PropTypes.object,
      password: PropTypes.object,
    }),
    additional_info_text: PropTypes.object,
    buttons: PropTypes.object,
    links: PropTypes.object,
  }).isRequired,
  language: PropTypes.string.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  orgSlug: PropTypes.string.isRequired,
  privacyPolicy: PropTypes.shape({
    title: PropTypes.object,
    content: PropTypes.object,
  }).isRequired,
  termsAndConditions: PropTypes.shape({
    title: PropTypes.object,
    content: PropTypes.object,
  }).isRequired,
  authenticate: PropTypes.func.isRequired,
};
