import React, { useEffect } from "react";
import Glide, {
  Swipe,
  Breakpoints,
  Controls,
} from "@glidejs/glide/dist/glide.modular.esm";
import shave from "shave";

import PostCard from "./PostCard";

const RelatedPosts = ({ posts }) => {
  useEffect(() => {
    if (posts?.length > 0) {
      const recommendedSlider = new Glide(".js-recommended-slider", {
        type: "slider",
        rewind: false,
        perView: 3,
        swipeThreshold: false,
        dragThreshold: false,
        gap: 0,
        // direction: isRTL() ? 'rtl' : 'ltr',
        breakpoints: {
          1023: {
            type: "carousel",
            perView: 2,
            swipeThreshold: 80,
            dragThreshold: 120,
          },
          720: {
            type: "carousel",
            perView: 2,
            swipeThreshold: 80,
            dragThreshold: 120,
          },
          568: {
            type: "carousel",
            perView: 1,
            swipeThreshold: 80,
            dragThreshold: 120,
          },
        },
      });

      const Length = (Glide, Components, Events) => {
        return {
          mount() {
            Events.emit("length.change", Components.Sizes.length);
          },
        };
      };

      recommendedSlider.on("mount.after", () => {
        shave(".js-article-card-title", 100);
        shave(".js-article-card-title-no-image", 250);
      });

      recommendedSlider.on("length.change", (length) => {
        if (length === 1) {
          recommendedSlider.update({ type: "slider" });
          //   $recommendedSlider.find('.js-controls').remove()
        }
      });

      recommendedSlider.mount({ Controls, Swipe, Breakpoints, Length });
    }
  }, []);

  return (
    <section className="m-recommended">
      <div className="l-wrapper in-recommended">
        <h3 className="m-section-title in-recommended">
          {/* {{t "Recommended for you"}} */}
          Recommended for you
        </h3>
        <div className="m-recommended-articles">
          <div className="m-recommended-slider glide js-recommended-slider">
            <div className="glide__track" data-glide-el="track">
              <div className="glide__slides">
                {posts?.length > 0 ? (
                  posts.map(({ node: post }) => (
                    <div
                      key={post.fields.slug}
                      className="m-recommended-slider__item glide__slide"
                    >
                      <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <div className="m-recommended-slider__item glide__slide">
                    <header className="m-heading no-margin">
                      <h3>
                        {/* {{t "No posts found"}} */}
                        No posts found
                      </h3>
                      <p>
                        {/* {{t "Apparently there are no posts at the moment, check again later."}} */}
                        Apparently there are no posts at the moment, check again
                        later.
                      </p>
                    </header>
                  </div>
                )}
              </div>
            </div>
            {posts?.length > 1 && (
              <div
                data-glide-el="controls"
                className="glide__arrows js-controls"
              >
                <button
                  data-glide-dir="<"
                  className="m-icon-button filled in-recommended-articles glide-prev"
                  aria-label="Previous"
                >
                  <span className="icon-arrow-left" aria-hidden="true"></span>
                </button>
                <button
                  data-glide-dir=">"
                  className="m-icon-button filled in-recommended-articles glide-next"
                  aria-label="Next"
                >
                  <span className="icon-arrow-right" aria-hidden="true"></span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
