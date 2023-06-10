/**
 * Layout component to standarize the dimensions and components on each page
 */

import * as React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          social {
            twitter
            instagram
            github
          }
        }
      }
    }
  `);
  const social = data.site.siteMetadata?.social;

  let header;
  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    );
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    );
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <div className="footer-links">
          <a href={`https://twitter.com/${social?.twitter || ``}`}>Twitter</a>
          <a href={`https://instagram.com/${social?.instagram || ``}`}>
            Instagram
          </a>
          <a href={`https://github.com/${social?.github || ``}`}>GitHub</a>
        </div>
        © {new Date().getFullYear()},{` `}
        Henry Burgess
      </footer>
    </div>
  );
};

export default Layout;
