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
        <h1>About Me</h1>
      </header>

      <div>
        <p>
          I grew up in Australia, spending most of my childhood in and around sunny Brisbane.
          I had the opportunity to see a lot of Australia, not only travelling,
          but also living in Alice Springs and Adelaide.
        </p>

        <p>
          I took the opportunity to relocate to St. Louis, Missouri at the end of 2021
          to continue my career as a Software Engineer working in Neuroscience. I'm currently working
          in a Neuroscience lab at WashU, where we focus on understanding human brain development and how
          the brain is wired in early development. I get to work on many different research projects
          while having the privilege of helping advance our understanding of the brain.
        </p>

        <p>
          Outside of my work, I love to be outdoors! My biggest hobby right now is fishing, and fishing is
          a great way to travel the US and explore new locations. I enjoy challenging myself in
          this context and appreciating the best of what the US has to offer. I try and document some
          of the best photos and highlights in this travel diary.
        </p>

        <p>
          When I'm not travelling, I'm fishing, paddleboarding, or spending some quality
          time with friends!
        </p>

        <p>
          Thanks for reading my travel diary.
        </p>
      </div>

      <div>
        <h3>Where I've Travelled</h3>

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
