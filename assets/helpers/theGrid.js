// @flow

// ----- Types ----- //

export type ImageType = 'jpg' | 'png';


// ----- Setup ----- //

export const GRID_DOMAIN = 'https://media.guim.co.uk';

export const imageCatalogue: {
  [string]: string,
} = {
  newsroom: '8caacf301dd036a2bbb1b458cf68b637d3c55e48/0_0_1140_683',
  guardianObserverOffice: '137d6b217a27acddf85512657d04f6490b9e0bb1/1638_0_3571_2009',
  liveEvent: '5f18c6428e9f31394b14215fe3c395b8f7b4238a/500_386_2373_1335',
  digitalBundle: '7c7b9580924281914e82dc163bf716ede52daa8b/0_0_600_360',
  paperBundle: '4d0851394ce3c100649800733f230a78c0d38555/0_0_600_360',
  paperDigitalBundle: '1199912112859eecf3f2d94edc6fdd73843d10e9/0_0_600_360',
  protestorsWide: 'bce7d14f7f837a4f6c854d95efc4b1eab93a8c65/0_0_5200_720',
  protestorsNarrow: 'd1a7088f8f2a367b0321528f081777c9b5618412/0_0_3578_2013',
  digitalCircle: '639c3abc4c09281aedb515d684ac4053ef38a1df/0_0_825_825',
  paperCircle: 'c462d60f2962b745b1e206d5ede998dfb166a8ed/0_0_825_825',
  paperDigitalCircle: 'd94c0f9bade09487b9afca5ee8149efb33f34ccf/0_0_825_825',
  digitalSubscriptionHeaderDesktop: '1c1edff99ab1df4f391d95ef458b0410d3ceb555/0_0_4045_1950',
  digitalSubscriptionHeaderTablet: 'ad43b51a060641301dff912731bd2a24a9b18523/0_0_2035_1660',
  digitalSubscriptionHeaderMobile: '3c93c914ea14da695a098bb1712d3bc974d20114/0_0_1200_1755',
};

// Utility type: https://flow.org/en/docs/types/utilities/#toc-keys
export type ImageId = $Keys<typeof imageCatalogue>;


// ----- Functions ----- //

// Builds a grid url from and id and an image size.
// Example: https://media.guim.co.uk/g65756g5/300.jpg
export function gridUrl(
  gridId: ImageId,
  size: number,
  imgType: ImageType = 'jpg',
): string {

  const path = `${imageCatalogue[gridId]}/${size}.${imgType}`;
  const url = new URL(path, GRID_DOMAIN);

  return url.toString();

}

// Returns a series of grid urls and their corresponding sizes.
// Example:
//   "https://media.guim.co.uk/g65756g5/300.jpg 300w,
//    https://media.guim.co.uk/g65756g5/500.jpg 500w,
//    https://media.guim.co.uk/g65756g5/700.jpg 700w"
export function gridSrcset(
  gridId: ImageId,
  sizes: number[],
  imgType: ImageType = 'jpg',
): string {

  const sources = sizes.map(size => `${gridUrl(gridId, size, imgType)} ${size}w`);
  return sources.join(', ');

}
