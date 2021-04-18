import React from "react";

const Footer = ({ siteMetadata }) => {
  return (
    <footer className="m-footer">
      <div className="m-footer__content">
        <p className="m-footer-copyright">
          <span>{siteMetadata.title} &copy; 2021</span>
          <span>&nbsp; &bull; &nbsp;</span>

          <span>
            {/* {{t "Published with"}}  */}
            Built with{" "}
            <a href="https://www.gatsbyjs.com/" target="_blank" rel="noopener">
              Gatsby 💜
            </a>
          </span>

          <br />

          <span>
            Theme by{" "}
            <a href="https://eduardogomez.io/" target="_blank" rel="noopener">
              Eduardo Gómez
            </a>
          </span>
        </p>

        <nav className="m-footer-social">
          {siteMetadata?.social?.facebook && (
            <a
              href={`https://facebook.com/${siteMetadata?.social?.facebook}`}
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <span className="icon-facebook" aria-hidden="true"></span>
            </a>
          )}
          {siteMetadata?.social?.twitter && (
            <a
              href={`https://twitter.com/${siteMetadata?.social?.twitter}`}
              target="_blank"
              rel="noopener"
              aria-label="Twitter"
            >
              <span className="icon-twitter" aria-hidden="true"></span>
            </a>
          )}
          {/*
             
             <a href="{{@site.url}}/rss" aria-label="RSS">
             <span className="icon-rss" aria-hidden="true"></span>
            </a> */}
        </nav>
        {/* <p className="m-footer-copyright jslicense">
                  <a href="{{asset "html/javascript.html"}}" rel="jslicense">{{t "JavaScript license information"}}</a>
                </p> */}
      </div>
    </footer>
  );
};

export default Footer;
