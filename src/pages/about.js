import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";

const About = ({ data, location }) => {
  const title = data.site.siteMetadata?.title || `About`;

  return (
    <Layout location={location} title={title}>
      <header>
        <h1>About Me</h1>
      </header>

      <div>
        <p>
          Originally from Australia, I relocated to St. Louis at the end of 2021
          to continue a career in neuroscience research. As a Software Engineer,
          I often get to work on exciting new human research projects while
          having the privilege of meeting those who will directly benefit from
          our increased understanding of the brain.
        </p>

        <p>
          Outside of work, I love to be outdoors! I enjoy challenging myself in
          this context and appreciating the best of what the United States has
          to offer. I try and document some of the best photos and highlights in
          this travel diary. When I'm not travelling, I'm at a coffee shop,
          reading, or experiencing St. Louis with friends!
        </p>
      </div>
    </Layout>
  );
};

export default About;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="About" />;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
