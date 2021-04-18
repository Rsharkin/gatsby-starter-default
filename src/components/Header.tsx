import React, { useState, useEffect, Fragment } from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import classnames from "classnames";
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import shave from "shave";
import Glide, {
  Swipe,
  Breakpoints,
} from "@glidejs/glide/dist/glide.modular.esm";

import TooltipWrapper from "./TooltipWrapper";

const SITE_LOGO = "../../content/assets/images/logo.png";

const Header = (props) => {
  const { siteMetadata, theme, onThemeChange } = props;

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [showSubMenu, setShowSubMenu] = useState(false);

  const [showSecondaryNavigation, setShowSecondaryNavigation] = useState(false);

  const data = useStaticQuery(graphql`
    query HeaderContent {
      tags: allTagsYaml(limit: 10) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }

      posts: allMarkdownRemark(
        limit: 4
        sort: { fields: frontmatter___published_at, order: DESC }
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              published_at(formatString: "DD MMM, YYYY")
              feature_image {
                childImageSharp {
                  gatsbyImageData(
                    width: 300
                    layout: CONSTRAINED
                    placeholder: BLURRED
                  )
                }
              }
            }
          }
        }
      }

      navigation: allNavigationYaml {
        edges {
          node {
            id
            label
            url
          }
        }
      }
    }
  `);

  useEffect(() => {
    const recentSlider = new Glide(".js-recent-slider", {
      type: "slider",
      rewind: false,
      perView: 4,
      swipeThreshold: false,
      dragThreshold: false,
      gap: 0,
      // direction: isRTL() ? "rtl" : "ltr",
      breakpoints: {
        1024: {
          perView: 3,
          swipeThreshold: 80,
          dragThreshold: 120,
        },
        768: {
          perView: 2,
          swipeThreshold: 80,
          dragThreshold: 120,
          peek: { before: 0, after: 115 },
        },
        568: {
          perView: 1,
          swipeThreshold: 80,
          dragThreshold: 120,
          peek: { before: 0, after: 115 },
        },
      },
    });

    recentSlider.on("mount.after", () => {
      shave(".js-recent-article-title", 50);
    });

    recentSlider.mount({ Swipe, Breakpoints });
  }, []);

  const handleMoreClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowSecondaryNavigation(true);
  };

  const toggleMobileMenu = () =>
    setShowMobileMenu((showMobileMenu) => !showMobileMenu);

  const toggleSubMenu = () => setShowSubMenu((showSubMenu) => !showSubMenu);

  const handleOutsideClick = () => {
    setShowSecondaryNavigation(false);
  };

  const { title, logo } = siteMetadata;

  const navigation = data?.navigation?.edges;
  const secondaryNavigation = data?.secondaryNavigation?.edges;

  const tags = data?.tags?.edges;

  const posts = data?.posts?.edges;

  const SUB_MENU = (
    <li className="submenu-option js-submenu-option">
      <button
        className={classnames(
          "m-icon-button in-menu-main more js-toggle-submenu",
          {
            active: showSubMenu,
          }
        )}
        aria-label="Open submenu"
        onClick={toggleSubMenu}
      >
        {/* aria-label="{{t "Open submenu"}}" */}
        <span className="icon-more" aria-hidden="true"></span>
      </button>
      <div
        className={classnames("m-submenu js-submenu", {
          opened: showSubMenu,
          closed: !showSubMenu,
        })}
      >
        <div className="l-wrapper in-submenu">
          <section className="m-recent-articles">
            <h3 className="m-submenu-title in-recent-articles">
              {/* {{t "Recent articles"}} */}
              Recent articles
            </h3>
            {posts?.length > 0 ? (
              <div className="glide js-recent-slider">
                <div className="glide__track" data-glide-el="track">
                  <div className="glide__slides">
                    {posts.map(({ node: post }) => {
                      const { frontmatter, fields } = post;

                      const featureImage = getImage(frontmatter.feature_image);

                      return (
                        <div
                          key={fields.slug}
                          className="glide__slide"
                          id={fields.slug}
                        >
                          <Link
                            to={`/blog${fields.slug}`}
                            className="m-recent-article"
                          >
                            <div className="m-recent-article__picture {{#unless feature_image}}no-picture{{/unless}}">
                              {featureImage ? (
                                <GatsbyImage
                                  alt=""
                                  loading="lazy"
                                  image={featureImage}
                                />
                              ) : (
                                <img
                                  src="images/no-image.png"
                                  loading="lazy"
                                  alt=""
                                // todo
                                />
                              )}
                            </div>
                            <h3
                              className="m-recent-article__title js-recent-article-title"
                              title={frontmatter.title}
                            >
                              {frontmatter.title}
                            </h3>
                            <span className="m-recent-article__date">
                              {/* {{date published_at timeago="true"}} */}
                              {frontmatter.published_at}
                            </span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="m-not-found in-recent-articles">
                {/* {{t "No recent articles found :("}} */}
                No recent articles found :(
              </div>
            )}
          </section>
          <section className="m-tags">
            <h3 className="m-submenu-title">
              {/* {{t "Tags"}} */}
              Tags
            </h3>
            <ul>
              {tags ? (
                tags.map(({ node: tag }) => (
                  <li key={tag.slug}>
                    <Link to={`/tag/${tag.slug}`}>{tag.name}</Link>
                  </li>
                ))
              ) : (
                <li className="m-not-found">No tags found :(</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </li>
  );

  return (
    <header
      className={classnames("m-header with-picture js-header", {
        "mobile-menu-opened": showMobileMenu,
        "submenu-is-active": showSubMenu,
      })}
    >
      <div className="m-mobile-topbar" data-aos="fade-down">
        <button
          className="m-icon-button in-mobile-topbar js-open-menu"
          aria-label="Open menu"
          onClick={toggleMobileMenu}
        >
          <span className="icon-menu" aria-hidden="true"></span>
        </button>
        {/* {(
          <Link to="/" className="m-site-name in-mobile-topbar">
            {title}
          </Link>
        )} */}
        <button
          className="m-icon-button in-mobile-topbar js-open-search"
          aria-label="Open search"
          onClick={props.onSearchClick}
        >
          <span className="icon-search" aria-hidden="true"></span>
        </button>
      </div>

      <div
        className={classnames("m-menu js-menu", {
          opened: showMobileMenu,
        })}
      >
        <button
          className="m-icon-button outlined as-close-menu js-close-menu"
          onClick={toggleMobileMenu}
          aria-label="Close menu"
        >
          <span className="icon-close"></span>
        </button>
        <div className="m-menu__main" data-aos="fade-down">
          <div className="l-wrapper">
            <div className="m-nav js-main-nav">
              <nav
                className="m-nav__left js-main-nav-left"
                role="navigation"
                aria-label="Main menu"
              >
                <ul>
                  {/* {(
                    <li className="only-desktop">
                      <Link to="/" className="m-site-name in-desktop-menu">
                        {title}
                      </Link>
                    </li>
                  )} */}
                  {navigation?.length > 0 &&
                    navigation.map(({ node: navigationItem }, index) => (
                      <li
                        key={index}
                        className="nav-{{slug}}{{#if current}} nav-current{{/if}}"
                      >
                        <Link to={navigationItem.url}>
                          {navigationItem.label}
                        </Link>
                      </li>
                    ))}
                  {secondaryNavigation?.length > 0 && (
                    <TooltipWrapper
                      arrow
                      interactive
                      appendTo={() => document.body}
                      visible={showSecondaryNavigation}
                      onClickOutside={handleOutsideClick}
                      placement="bottom"
                      content={
                        <div id="secondary-navigation-template">
                          <ul className="m-secondary-menu">
                            {secondaryNavigation.map(
                              ({ node: navigationItem }, index) => (
                                <li
                                  key={index}
                                  className="nav-{{slug}}{{#if current}} nav-current{{/if}}"
                                >
                                  <Link to={navigationItem.url}>
                                    {navigationItem.label}
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      }
                    >
                      <li className="more">
                        <span>
                          <a
                            href="#"
                            className="js-open-secondary-menu"
                            onClick={handleMoreClick}
                          >
                            {/* {{t "More"}} */}
                            More
                            <span
                              className="icon-chevron-down"
                              aria-hidden="true"
                            ></span>
                          </a>
                        </span>
                      </li>
                    </TooltipWrapper>
                  )}

                  {SUB_MENU}
                </ul>
              </nav>

              <div className="m-nav__right">
                <button
                  className="m-icon-button in-menu-main js-open-search"
                  aria-label="Open search"
                  onClick={props.onSearchClick}
                >
                  <span className="icon-search" aria-hidden="true"></span>
                </button>
                <TooltipWrapper content="Toggle dark mode">
                  <div className="m-toggle-darkmode js-tooltip" tabIndex={0}>
                    {/* data-tippy-content="{{t "Toggle dark mode"}}" */}
                    <label htmlFor="toggle-darkmode" className="sr-only">
                      {/* {{t "Toggle dark mode"}} */}
                      Toggle dark mode
                    </label>
                    <input
                      id="toggle-darkmode"
                      type="checkbox"
                      className="js-toggle-darkmode"
                      checked={theme === "dark"}
                      onChange={onThemeChange}
                    />
                    <div>
                      <span
                        className="icon-moon moon"
                        aria-hidden="true"
                      ></span>
                      <span
                        className="icon-sunny sun"
                        aria-hidden="true"
                      ></span>
                    </div>
                  </div>
                </TooltipWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header >
  );
};

export default Header;
