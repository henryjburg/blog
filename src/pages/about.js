import * as React from "react";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";
import Map from "../components/map";

const About = ({ data, location }) => {
  const title = data.site.siteMetadata?.title || `About`;

  return (
    <Layout location={location} title={title}>
      <header>
        <h1>About Henry</h1>
      </header>

      <div>
        <p>
          I grew up in Australia, spending most of my childhood in and around sunny Brisbane!
          I had the opportunity to see a lot of Australia, not only travelling,
          but also spending time living in Alice Springs and Adelaide.
        </p>

        <p>
          I had the opportunity to relocate to St. Louis, Missouri at the end of 2021
          to pursue a career as a Software Engineer in neuroscience. I'm currently working
          in a neuroscience lab at WashU, and I get to work on exciting human research projects
          while having the privilege of meeting those who will directly benefit from
          our increased understanding of the brain.
        </p>

        <p>
          Outside of work, I love to be outdoors! I enjoy challenging myself in
          this context and appreciating the best of what the United States has
          to offer. I try and document some of the best photos and highlights in
          this travel diary.
        </p>

        <p>
          When I'm not travelling, I'm at a coffee shop, reading, or spending some quality
          time with friends!
        </p>

        <p>
          Thanks for reading this little diary.
        </p>

        <Map />
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
