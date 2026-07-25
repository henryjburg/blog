/**
 * Decorative topographic contour-line divider, used in place of a plain <hr />
 */

import * as React from "react";

const ContourDivider = () => (
  <svg
    className="contour-divider"
    viewBox="0 0 400 40"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      className="contour-divider-line contour-divider-line-1"
      d="M0,22 C 26,10 48,8 74,20 C 100,32 122,30 148,18 C 174,6 198,10 222,22 C 246,34 268,28 294,16 C 320,4 344,10 368,20 C 380,25 392,24 400,20"
    />
    <path
      className="contour-divider-line contour-divider-line-2"
      d="M0,14 C 30,26 54,28 80,16 C 106,4 130,6 154,18 C 178,30 202,32 228,20 C 254,8 278,10 302,22 C 326,34 350,30 374,18 C 384,13 394,13 400,16"
    />
    <path
      className="contour-divider-line contour-divider-line-3"
      d="M0,30 C 22,20 44,16 68,26 C 92,36 116,34 140,24 C 164,14 188,16 212,28 C 236,40 260,34 284,22 C 308,10 332,14 356,24 C 372,30 388,28 400,24"
    />
  </svg>
);

export default ContourDivider;
