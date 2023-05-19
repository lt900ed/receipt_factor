// [i * 2 for i in range(10)]
// ↓
// [...Array(10).keys()].map((d) => {return d * 2});

// [i * 2 for i in range(10) if i % 2 == 0]
// ↓
// [...Array(10).keys()].filter((d) => d % 2).map((d) => d * 2);

// 検出範囲指定用定数
const width_full = 1124;
const width_narrow = 1079;
const x_full = 206;
const x_narrow = 218;
const x_params = 215;
const rect_prop = {
  close: [539, 1828, 458, 132],
  whole: [x_full, 51, width_full, 1950],
  scroll: [x_narrow, 947, width_narrow, 831],
  bottom_row: [x_narrow, 1695, width_narrow, 80],
  icon: [347, 235, 150, 150],
  eval_val: [357, 427, 133, 37],
  speed_val: [315, 556, 103, 37],
};
rect_prop['bottom_row_higher'] = [rect_prop['bottom_row'][0], rect_prop['bottom_row'][1] - 60, rect_prop['bottom_row'][2], rect_prop['bottom_row'][3] + 60];
rect_prop['scroll_with_header'] = [rect_prop['whole'][0], rect_prop['whole'][1], rect_prop['whole'][2], rect_prop['scroll'][1] + rect_prop['scroll'][3] - rect_prop['whole'][1]];
rect_prop['scroll_full_width'] = [rect_prop['whole'][0], rect_prop['scroll'][1], rect_prop['whole'][2], rect_prop['scroll'][3]];
rect_prop['header'] = [rect_prop['whole'][0], rect_prop['whole'][1], rect_prop['whole'][2], 100];
rect_prop['basic_info'] = [rect_prop['header'][0], rect_prop['header'][1] + rect_prop['header'][3], rect_prop['header'][2], 700];
rect_prop['tab'] = [rect_prop['basic_info'][0], rect_prop['basic_info'][1] + rect_prop['basic_info'][3], rect_prop['basic_info'][2], 70];
rect_prop['stamina_val'] = [rect_prop['speed_val'][0] + x_params, rect_prop['speed_val'][1], rect_prop['speed_val'][2], rect_prop['speed_val'][3]];
rect_prop['power_val'] = [rect_prop['stamina_val'][0] + x_params, rect_prop['speed_val'][1], rect_prop['speed_val'][2], rect_prop['speed_val'][3]];
rect_prop['guts_val'] = [rect_prop['power_val'][0] + x_params, rect_prop['speed_val'][1], rect_prop['speed_val'][2], rect_prop['speed_val'][3]];
rect_prop['int_val'] = [rect_prop['guts_val'][0] + x_params, rect_prop['speed_val'][1], rect_prop['speed_val'][2], rect_prop['speed_val'][3]];

// しきい値
const thres_gray = 240;
const thres_cont_close = 0.8;
const thres_match_tmpl = 0.92;
const thres_match_tmpl_basic_info = 0.85;
const thres_match_tmpl_higher = 0.5;
const thres_header = 0.9;

//パラメータ
const force_one_group = false;
const ele_tmpl_close = document.getElementById('tmplClose')

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
function cv2_rectangle(img, rect, rectangle_color, line_weight) {
  let point1 = new cv.Point(rect.x, rect.y);
  let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
  cv.rectangle(img, point1, point2, rectangle_color, line_weight, cv.LINE_AA, 0);
}
function calc_rects(rect_close, rect_prop) {
  let out = {};
  let tgt_per_prop_w = rect_close.width / rect_prop.close[2]
  let tgt_per_prop_h = rect_close.height / rect_prop.close[3]
  Object.keys(rect_prop).forEach(function (k) {
    out[k] = {
      'x': Math.floor(rect_close.x + (rect_prop[k][0] - rect_prop.close[0]) * tgt_per_prop_w),
      'y': Math.floor(rect_close.y + (rect_prop[k][1] - rect_prop.close[1]) * tgt_per_prop_w),
      'width': Math.floor(rect_prop[k][2] * tgt_per_prop_w),
      'height': Math.floor(rect_prop[k][3] * tgt_per_prop_w)
    }
  });
  return out;
}

function detect_rects(img_in) {
  let img_gray = img_in.clone();
  cv.cvtColor(img_gray, img_gray, cv.COLOR_RGBA2GRAY, 0);
  let ksize = new cv.Size(5, 5);
  cv.GaussianBlur(img_gray, img_gray, ksize, 0, 0, cv.BORDER_DEFAULT);
  cv.threshold(img_gray, img_gray, thres_gray, 255, cv.THRESH_BINARY);

  let mv_contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // 入力画像で輪郭抽出
  cv.findContours(img_gray, mv_contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  // 小さい輪郭は除外して再格納
  let mv_contours_only_large = new cv.MatVector();
  for (let i = 0; i < mv_contours.size(); i++) {
    if (cv.contourArea(mv_contours.get(i)) > (img_gray.cols ** 2) / 80) {
      mv_contours_only_large.push_back(mv_contours.get(i));
    }
  };
  // 閉じるボタンテンプレ読み込み
  let tmpl_gray = cv.imread(ele_tmpl_close);
  cv.cvtColor(tmpl_gray, tmpl_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(tmpl_gray, tmpl_gray, ksize, 0, 0, cv.BORDER_DEFAULT);
  cv.threshold(tmpl_gray, tmpl_gray, thres_gray, 255, cv.THRESH_BINARY);
  let mv_tmpl_contours = new cv.MatVector();
  let tmpl_hierarchy = new cv.Mat();
  // 閉じるボタン輪郭抽出
  cv.findContours(tmpl_gray, mv_tmpl_contours, tmpl_hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  // 小さい輪郭は除外して配列に再格納
  let l_tmpl_contours_only_large = [];
  for (let i = 0; i < mv_tmpl_contours.size(); i++) {
    if (cv.contourArea(mv_tmpl_contours.get(i)) > (img_gray.cols ** 2) / 80) {
      l_tmpl_contours_only_large.push(mv_tmpl_contours.get(i));
    }
  };
  // 大きい順に2番目のを閉じるボタンの輪郭として採用
  l_tmpl_contours_only_large.sort((first, second) => cv.contourArea(second) - cv.contourArea(first));
  let msk_close = l_tmpl_contours_only_large[1];
  // console.log(cv.boundingRect(msk_close));

  // テンプレと比較して閉じるボタンの輪郭だけ抽出
  let cont_out = [];
  let info_out = [];
  let is_close_val = 1.0;
  let min_is_close_val = 1.0;
  let only_matched = true;
  for (let i = 0; i < mv_contours_only_large.size(); i++) {
    is_close_val = cv.matchShapes(mv_contours_only_large.get(i), msk_close, cv.CONTOURS_MATCH_I3, 0);
    if (!only_matched || (is_close_val < thres_cont_close && is_close_val < min_is_close_val)) {
      cont_out.push(mv_contours_only_large.get(i));
      info_out.push({
        'index': i,
        'is_close': is_close_val < thres_cont_close,
        'is_close_val': is_close_val
      });
      min_is_close_val = is_close_val;
    }
  };
  let rect_close = cv.boundingRect(cont_out[0]);
  // 一度wholeの枠座標を計算
  let rect_whole = calc_rects(rect_close, {'whole': rect_prop.whole, 'close': rect_prop.close});
  // console.log(rect_close);
  // console.log(rect_whole);

  // ヘッダー部分がどのyから始まってるか調査
  let y_start = Math.max(0, Math.floor(rect_whole.whole.y - rect_whole.whole.height / 20))
  let img_find_header = img_in.roi(new cv.Rect(0, y_start, img_in.cols, Math.floor(rect_whole.whole.height / 10)));
  cv.cvtColor(img_find_header, img_find_header, cv.COLOR_RGB2HSV, 0);
  let green = new cv.Mat()
  // ヘッダー辺りで緑っぽいピクセルを抽出
  cv.inRange(
    img_find_header,
    new cv.Mat(img_find_header.rows, img_find_header.cols, img_find_header.type(), [30, 190, 0, 0]),
    new cv.Mat(img_find_header.rows, img_find_header.cols, img_find_header.type(), [90, 255, 255, 0]),
    green);

  // 上から見ていってほぼ全セルが緑っぽい行(＝ウマ娘詳細ヘッダーの始まり)をy_actに格納
  let y_act = rect_whole.whole.y;
  let tmp_sum = 0;
  for (let i = 0; i < green.rows; i++) {
    tmp_sum = 0;
    for (let j = 0; j < green.cols; j++) {
      tmp_sum += green.ucharAt(i, j);
    }
    if ((tmp_sum / 255) / green.cols > thres_header) {
      y_act = y_start + i
      break;
    }
  }

  // 発見したヘッダー開始位置に合わせてrect_closeを調整
  let height_act = rect_whole.whole.height - (y_act - rect_whole.whole.y)
  let act_rate = height_act / rect_whole.whole.height
  rect_close = {
    'x': rect_close.x + (rect_close.width * (1 - act_rate)) / 2,
    'y': rect_close.y + (rect_close.height * (1 - act_rate)) / 2,
    'width': rect_close.width * act_rate,
    'height': rect_close.height * act_rate,
  };
  // 枠座標を再計算
  rects = calc_rects(rect_close, rect_prop);

  // 輪郭描画
  // let dst = cv.Mat.zeros(img_gray.rows, img_gray.cols, cv.CV_8UC3);
  // let dst = img_in.clone();
  // cv.cvtColor(dst, dst, cv.COLOR_RGBA2RGB, 0);
  // for (let i = 0; i < mv_contours_only_large.size(); ++i) {
  //     let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
  //                               Math.round(Math.random() * 255));
  //     cv.drawContours(dst, mv_contours_only_large, i, color, 2, cv.LINE_8);
  // };
  // cv2_rectangle(dst, rects.whole, new cv.Scalar(255, 0, 0), 1);
  // let tmpCanvasElement = document.createElement('canvas');
  // tmpCanvasElement.setAttribute('id', 'canvasOutput');
  // document.getElementById('overview').appendChild(tmpCanvasElement);
  // cv.imshow('canvasOutput', dst);

  return rects;
}

function generateReceipt(l_mat) {
  console.log(l_mat.length, l_mat[0].rows, l_mat[0].cols);
  let l_rects = [];
  for (let i = 0; i < l_mat.length; i++) {
    l_rects.push(detect_rects(l_mat[i]));
    cv.cvtColor(l_mat[i], l_mat[i], cv.COLOR_RGBA2RGB, 0);
    cv2_rectangle(l_mat[i], l_rects[i].whole, new cv.Scalar(255, 0, 0), 10);
  }
  var dst = new cv.Mat();
  dst = hconcat_resize_min(l_mat);
  dst = cv2_resize_fixed_aspect(dst, -1, 300);

  // var dst = new cv.Mat();
  // var res = [];
  // for (let i = 0; i < l_mat.length; i++) {
  //   res = detect_rects(l_mat[i], rect_prop, path_tmpl_close, thres_gray, thres_cont_close, thres_header)
  // };







  return dst;
}