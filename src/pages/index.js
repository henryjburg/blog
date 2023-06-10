import * as React from "react";
import { Link, graphql } from "gatsby";

import Bio from "../components/bio";
import Layout from "../components/layout";
import Seo from "../components/seo";

const Index = ({ data, location }) => {
  const title = data.site.siteMetadata?.title || `Home`;
  const posts = data.allMarkdownRemark.nodes;

  const archivedPosts = posts.filter((post) => {
    return post.frontmatter.archive;
  });
  const activePosts = posts.filter((post) => {
    return !post.frontmatter.archive;
  });

  if (activePosts.length === 0) {
    return (
      <Layout location={location} title={title}>
        <Bio />
        <p>No posts just yet!</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={title}>
      <Bio />
      <ol style={{ listStyle: `none` }}>
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
                  <small>{post.frontmatter.date}</small>
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
          )
        })}
      </ol>
    </Layout>
  )
}

export default Index

/**
 * Head export to define metadata for the page
 */
export const Head = () => <Seo title="All posts" />

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
`
