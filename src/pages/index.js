import * as React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";

const Index = ({ data, location }) => {
  const title = data.site.siteMetadata?.title || `Home`;
  const posts = data.allMarkdownRemark.nodes;

  const activePosts = posts.filter(post => {
    return !post.frontmatter.archive;
  });

  if (activePosts.length === 0) {
    return (
      <Layout location={location} title={title}>
        <Bio />
        <p>No posts just yet!</p>
      </Layout>
    );
  }

  const years = activePosts.map(post => post.frontmatter.date.slice(-4));
  const firstYear = years[years.length - 1];
  const lastYear = years[0];
  const yearRange = firstYear === lastYear ? firstYear : `${firstYear}–${lastYear}`;

  return (
    <Layout location={location} title={title}>
      <Bio />
      <p className="trip-count">
        {activePosts.length} trip{activePosts.length === 1 ? `` : `s`} logged
        &nbsp;·&nbsp; {yearRange}
      </p>
      <ol className="journal-list" style={{ listStyle: `none` }}>
        {activePosts.map(post => {
          const title = post.frontmatter.title || post.fields.slug;

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small className="post-list-item-date">
                    {post.frontmatter.date}
                  </small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default Index;

/**
 * Head export to define metadata for the page
 */
export const Head = () => <Seo title="Home" />;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          archive
        }
      }
    }
  }
`;
