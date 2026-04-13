/**
 * Bio component that displays a profile photo and brief introduction
 */

import * as React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            x
          }
        }
      }
    }
  `);

  const author = data.site.siteMetadata?.author;

  return (
    <div className="bio">
      <StaticImage
        className="bio-avatar"
        layout="fixed"
        formats={["auto", "webp", "avif"]}
        src="../images/profile.jpg"
        width={50}
        height={50}
        quality={95}
        alt="Profile picture"
      />
      {author?.name && (
        <p>
          A digital travel diary belonging to <strong>{author.name}</strong>.{" "}
          {author?.summary || null} <Link to={"/about"}>About Me →</Link>
        </p>
      )}
    </div>
  );
};

export default Bio;
