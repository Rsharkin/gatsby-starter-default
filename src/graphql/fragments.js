import { graphql } from "gatsby";

export const PostCardFragment = graphql`
  fragment PostCard on MarkdownRemark {
    timeToRead
    excerpt
    fields {
      slug
    }
    frontmatter {
      title
      published_at(formatString: "DD MMM, YYYY")
      featured
      feature_image {
        childImageSharp {
          gatsbyImageData(
            width: 600
            layout: CONSTRAINED
            placeholder: DOMINANT_COLOR
            outputPixelDensities: [1]
            webpOptions: { quality: 35 }
          )
        }
      }
      authors {
        id
        name
        profile_image
      }
      tags {
        id
        name
      }
    }
  }
`;
