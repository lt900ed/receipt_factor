// [i * 2 for i in range(10)]
// ↓
// [...Array(10).keys()].map((d) => {return d * 2});

// [i * 2 for i in range(10) if i % 2 == 0]
// ↓
// [...Array(10).keys()].filter((d) => d % 2).map((d) => d * 2);

function vconcat_resize_min(im_list, interpolation = cv.INTER_CUBIC) {
  const w_min = Math.min(...im_list.map((d) => {return d.cols}));
  let im_list_resize = new cv.MatVector();
  let dst = new cv.Mat();
  let dsize = new cv.Size();
  for (let i = 0; i < im_list.length; i++) {
    dst = new cv.Mat();
    dsize = new cv.Size(w_min, Math.floor(im_list[i].rows * w_min / im_list[i].cols));
    cv.resize(im_list[i], dst, dsize, 0, 0, interpolation);
    im_list_resize.push_back(dst);
  };
  dst = new cv.Mat();
  cv.vconcat(im_list_resize, dst);
  return dst;
};
function hconcat_resize_min(im_list, interpolation = cv.INTER_CUBIC) {
  const h_min = Math.min(...im_list.map((d) => {return d.rows}));
  let im_list_resize = new cv.MatVector();
  let dst = new cv.Mat();
  let dsize = new cv.Size();
  for (let i = 0; i < im_list.length; i++) {
    dst = new cv.Mat();
    dsize = new cv.Size(Math.floor(im_list[i].cols * h_min / im_list[i].rows), h_min);
    cv.resize(im_list[i], dst, dsize, 0, 0, interpolation);
    im_list_resize.push_back(dst);
  };
  dst = new cv.Mat();
  cv.hconcat(im_list_resize, dst);
  return dst;
}
function cv2_resize_fixed_aspect(img, width = -1, height = -1) {
  if (typeof img === 'undefined' || (width == -1 && height == -1)) {
    return void 0;
  } else {
    let dst = new cv.Mat();
    let dsize = new cv.Size();
    if (width == -1) {
      dsize = new cv.Size(Math.floor(height / img.rows * img.cols), height);
    } else {
      dsize = new cv.Size(width, Math.floor(width / img.cols * img.rows));
    };
    cv.resize(img, dst, dsize, 0, 0);
    return dst;
  }
}
function generateReceipt(l_mat) {
  console.log(l_mat.length, l_mat[0].rows, l_mat[0].cols);
  var dst = new cv.Mat();
  dst = hconcat_resize_min(l_mat);
  dst = cv2_resize_fixed_aspect(dst, -1, 300);
  return dst;
}