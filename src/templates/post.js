import * as React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";
import ContourDivider from "../components/contour-divider";

const PostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`;
  const { frontmatter } = post;
  const dateParts = new Date(`${frontmatter.date}T00:00:00`);
  const stampMonth = dateParts.toLocaleDateString("en-US", { month: "short" });
  const stampDay = dateParts.toLocaleDateString("en-US", { day: "numeric" });
  const stampYear = dateParts.toLocaleDateString("en-US", { year: "numeric" });

  const stats = [
    frontmatter.state && { label: "State", value: frontmatter.state },
    frontmatter.elevation && { label: "Elev", value: frontmatter.elevation },
    frontmatter.distance && { label: "Dist", value: frontmatter.distance },
    frontmatter.species?.length > 0 && {
      label: "Caught",
      value: frontmatter.species.join(", "),
    },
  ].filter(Boolean);

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <div className="post-header-row">
            <h1 itemProp="headline">{frontmatter.title}</h1>
            <div className="trip-stamp">
              <span className="trip-stamp-month">{stampMonth}</span>
              <span className="trip-stamp-day">{stampDay}</span>
              <span className="trip-stamp-year">{stampYear}</span>
            </div>
          </div>
          {stats.length > 0 && (
            <ul className="trip-stats">
              {stats.map(stat => (
                <li className="trip-stat" key={stat.label}>
                  {stat.label}: {stat.value}
                </li>
              ))}
            </ul>
          )}
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <ContourDivider />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav className="post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        description
        state
        elevation
        distance
        species
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
