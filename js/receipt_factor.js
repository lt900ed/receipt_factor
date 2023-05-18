function generateReceipt(l_mat) {
  console.log(l_mat.length, l_mat[0].rows, l_mat[0].cols);
  var dst = new cv.Mat();
  cv.cvtColor(l_mat[0], dst, cv.COLOR_RGBA2GRAY, 0);
  return dst;
}