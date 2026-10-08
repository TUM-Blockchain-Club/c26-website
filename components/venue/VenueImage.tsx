"use client";

import classNames from "classnames";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";

type VenueElement = React.ElementRef<"div">;
export type VenueProps = React.ComponentPropsWithoutRef<"div"> & {
  imageSrc: string | StaticImport;
  imageAlt: string;
};

export const VenueImage = React.forwardRef<VenueElement, VenueProps>(
  (props, ref) => {
    const { className, imageSrc, imageAlt, ...restProps } = props;
    return (
      <div
        className={classNames(
          className,
          "min-w-[280px] sm:min-w-[600px] xl:min-w-[800px] min-h-[200px] md:h-[350px] xl:h-[500px] relative",
        )}
        ref={ref}
        {...restProps}
      >
        {/* Cover, not the browser default of stretching to the box: the
            slides are not all exactly the frame's aspect ratio. */}
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill={true}
          // The box is 800px from xl up, so the switch has to sit one
          // pixel below the breakpoint or a 1280px window asks for the
          // 600px file and upscales it.
          sizes="(max-width: 639px) 280px, (max-width: 1279px) 600px, 800px"
          // Every slide but the first sits outside the clipped box, so
          // lazy loading never started them and they arrived blank.
          loading="eager"
          className="object-cover"
        />
      </div>
    );
  },
);
VenueImage.displayName = "Venue";
