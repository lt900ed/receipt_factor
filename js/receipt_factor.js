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
const x_factor_interval = 443;
const rect_prop = {
  close: [539, 1828, 458, 132],
  whole: [x_full, 51, width_full, 1910],
  scroll: [x_narrow, 947, width_narrow, 829],
  scroll_bar: [1297, 969, 21, 787],
  icon: [347, 235, 150, 150],
  eval_val: [357, 427, 133, 37],
  speed_val: [315, 556, 103, 37],
  growth_rate: [240, 848, 89, 34],
  register_partner: [541, 880, 454, 129],
  factor_area_left: [410, -20, 437, 90],
  factor_disc_left: [427, 0, 36, 36],
  factor_icon_left: [418, -9, 54, 54],
  factor_text_left: [469, 0, 372, 33],
  header_text_result_table: [686, 74, 165, 61],
  header_text_uma_detail: [639, 74, 258, 61],
  header_text_score_info: [639, 74, 258, 61],
  header_text_score_detail: [639, 74, 258, 61],
  header_text_field: [639, 74, 258, 61],
  header_text_race_detail: [639, 74, 258, 61],
  header_text_gougai: [506, 74, 524, 61],
  factor_text_left: [469, 0, 372, 33],
};
rect_prop['header'] = [rect_prop['whole'][0], rect_prop['whole'][1], rect_prop['whole'][2], 100];
rect_prop['basic_info'] = [rect_prop['header'][0], rect_prop['header'][1] + rect_prop['header'][3], rect_prop['header'][2], 700];
rect_prop['factor_disc_right'] = [rect_prop['factor_disc_left'][0] + x_factor_interval, 0, rect_prop['factor_disc_left'][2], rect_prop['factor_disc_left'][3]];
rect_prop['factor_icon_right'] = [rect_prop['factor_icon_left'][0] + x_factor_interval, 0, rect_prop['factor_icon_left'][2], rect_prop['factor_icon_left'][3]];
rect_prop['factor_text_right'] = [rect_prop['factor_text_left'][0] + x_factor_interval, 0, rect_prop['factor_text_left'][2], rect_prop['factor_text_left'][3]];

const rect_prop_dynamic = {
  with_growth_rate: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], rect_prop.basic_info[3] + 133],
    scroll: [x_narrow, 1076, width_narrow, rect_prop.scroll[3] - 129],
    scroll_bar: [1297, 1100, 21, 528],
  },
  with_register_partner: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], rect_prop.basic_info[3] + 205],
    scroll: [x_narrow, 1139, width_narrow, rect_prop.scroll[3] - 192],
    scroll_bar: [1297, 1164, 21, 592],
  },
  result_table: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], 641],
    scroll: [x_narrow, 792, width_narrow, rect_prop.scroll[3] + 163],
    scroll_bar: [1299, 815, 16, 945],
  },
  score_info: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], 0, 0],
    scroll: [x_narrow, 166, width_narrow, rect_prop.scroll[3] + 789],
    scroll_bar: [1293, 181, 16, 1584],
  },
  score_detail: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], 239],
    scroll: [x_narrow, 390, width_narrow, 1360],
    scroll_bar: [1297, 405, 16, 1345],
  },
  field: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], 0, 0],
    scroll: [x_narrow, 166, width_narrow, 1543],
    scroll_bar: [1293, 202, 16, 1563],
  },
  race_detail: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], 705],
    scroll: [x_narrow, 856, width_narrow, 920],
    scroll_bar: [1299, 879, 16, 874],
  },
  gougai: {
    basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], 962],
    scroll: [x_narrow, 1113, width_narrow, 665],
    scroll_bar: [1293, 202, 16, 1563],
  },
}

function add_rect_prop(rect_prop, rect_prop_dynamic, rayout_type) {
  let dict_out = {};
  Object.keys(rect_prop).forEach(function (key) {
    dict_out[key] = rect_prop[key];
  });
  if (rayout_type != 'normal') {
    Object.keys(rect_prop_dynamic[rayout_type]).forEach(function (key) {
      dict_out[key] = rect_prop_dynamic[rayout_type][key];
    });
  }
  dict_out['bottom_row'] = [rect_prop['scroll'][0], rect_prop['scroll'][1] + rect_prop['scroll'][3] - 80, rect_prop['scroll'][2], 80];
  dict_out['bottom_row_higher'] = [dict_out['bottom_row'][0], dict_out['bottom_row'][1] - 60, dict_out['bottom_row'][2], dict_out['bottom_row'][3] + 60];
  dict_out['scroll_with_header'] = [dict_out['whole'][0], dict_out['whole'][1], dict_out['whole'][2], dict_out['scroll'][1] + dict_out['scroll'][3] - dict_out['whole'][1]];
  dict_out['scroll_full_width'] = [dict_out['whole'][0], dict_out['scroll'][1], dict_out['whole'][2], dict_out['scroll'][3]];
  dict_out['tab'] = [dict_out['basic_info'][0], dict_out['basic_info'][1] + dict_out['basic_info'][3], dict_out['basic_info'][2], 70];
  dict_out['stamina_val'] = [dict_out['speed_val'][0] + x_params, dict_out['speed_val'][1], dict_out['speed_val'][2], dict_out['speed_val'][3]];
  dict_out['power_val'] = [dict_out['stamina_val'][0] + x_params, dict_out['speed_val'][1], dict_out['speed_val'][2], dict_out['speed_val'][3]];
  dict_out['guts_val'] = [dict_out['power_val'][0] + x_params, dict_out['speed_val'][1], dict_out['speed_val'][2], dict_out['speed_val'][3]];
  dict_out['int_val'] = [dict_out['guts_val'][0] + x_params, dict_out['speed_val'][1], dict_out['speed_val'][2], dict_out['speed_val'][3]];
  return dict_out
}

// しきい値
const thres_gray = 215;
const thres_cont_close = 0.1;
const thres_match_tmpl = 0.8;
const thres_match_tmpl_basic_info = 0.85;
const thres_match_tmpl_higher = 0.55;
const thres_match_tmpl_rayout_type = 0.6;
const thres_match_tmpl_disc = 0.1;
const thres_match_tmpl_disc_rate = 0.85;
const thres_header = 0.9;
const thres_common_diff_y1 = 20;
const thres_common_diff_y2 = 12;
const thres_scroll_bar_position = 210;
const thres_scbar_h = 0.90;
const thres_1factor = 140;
const thres_1factor_color = 0.3;

// パラメータ
const force_one_group = false;
const all_rayout_type = ['normal', 'with_growth_rate', 'with_register_partner', 'result_table', 'score_info', 'score_detail', 'field', 'race_detail', 'gougai', 'common_scroll_only', 'common_header_scroll'];
const load_parts = ['header', 'basic_info', 'tab', 'scroll_full_width', 'scroll', 'scroll_bar', 'bottom_row', 'bottom_row_higher', 'icon', 'eval_val', 'speed_val', 'stamina_val', 'power_val', 'guts_val', 'int_val'];
const load_parts_simple = ['header', 'basic_info', 'scroll_full_width', 'scroll', 'scroll_bar', 'bottom_row', 'bottom_row_higher'];
const load_parts_more_simple = ['header', 'scroll_full_width', 'scroll', 'scroll_bar', 'bottom_row', 'bottom_row_higher'];
const load_parts_common = ['header', 'scroll_full_width', 'scroll', 'bottom_row', 'bottom_row_higher', 'footer'];
const load_parts_scroll_only = ['scroll_full_width', 'scroll', 'bottom_row', 'bottom_row_higher', 'footer'];
const load_parts_1picture = ['scroll_full_width', 'scroll', 'bottom_row', 'bottom_row_higher'];
const tgt_parts_for_group = ['icon', 'eval_val', 'speed_val', 'stamina_val', 'power_val', 'guts_val', 'int_val', 'tab'];
const load_parts_by_rayout_type = {
  'normal': load_parts,
  'with_growth_rate': load_parts,
  'with_register_partner': load_parts,
  'result_table': load_parts_simple,
  'score_info': load_parts_more_simple,
  'score_detail': load_parts_simple,
  'field': load_parts_more_simple,
  'race_detail': load_parts_simple,
  'gougai': load_parts_simple,
  'common_scroll_only': load_parts_scroll_only,
  'common_header_scroll': load_parts_common,
  'common_1picture': load_parts_1picture,
}
const diff_window_size = 32;

function fn_sum(arr, fn) {
  if (fn) {
    return fn_sum(arr.map(fn));
  }
  else {
    return arr.reduce(function(prev, current, i, arr) {
      return prev + current;
    });
  }
};
function fn_avg(arr, fn) {
  return fn_sum(arr, fn) / arr.length;
};
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
  let out = new cv.Mat();
  cv.vconcat(im_list_resize, out);
  im_list_resize.delete();
  return out;
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
    dst.delete();
  };
  let out = new cv.Mat();
  cv.hconcat(im_list_resize, out);
  im_list_resize.delete();
  return out;
}
function cv2_resize_fixed_aspect(img, width = -1, height = -1) {
  if (typeof img === 'undefined' || (width == -1 && height == -1)) {
    return;
  } else {
    let dst = new cv.Mat();
    let dsize = new cv.Size();
    if (width == -1) {
      dsize = new cv.Size(Math.floor(height / img.rows * img.cols), height);
    } else {
      dsize = new cv.Size(width, Math.floor(width / img.cols * img.rows));
    };
    // console.log(img.size(), '→', dsize);
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
  if ('bottom_row' in out && 'scroll' in out) {
    out.bottom_row = {
      'x': out.bottom_row.x,
      'y': out.bottom_row.y,
      'width': out.bottom_row.width,
      'height': out.scroll.y + out.scroll.height - out.bottom_row.y
    }
  }
  if ('bottom_row_higher' in out && 'scroll' in out) {
    out.bottom_row_higher = {
      'x': out.bottom_row_higher.x,
      'y': out.bottom_row_higher.y,
      'width': out.bottom_row_higher.width,
      'height': out.scroll.y + out.scroll.height - out.bottom_row_higher.y
    }
  }
  return out;
}
function match_tmpl_min_max_loc(img_tgt, img_tmpl) {
  let dst = new cv.Mat();
  let out = null;
  cv.matchTemplate(img_tgt, img_tmpl, dst, cv.TM_CCOEFF_NORMED);
  out = cv.minMaxLoc(dst);
  dst.delete();
  return out;
}
function match_tmpl_with_msk_min_max_loc(img_tgt, img_tmpl, img_msk) {
  let dst = new cv.Mat();
  let out = null;
  // マスクなしと比べて遅すぎるのでモノクロで比較
  let img_tgt_gray = new cv.Mat();
  let img_tmpl_gray = new cv.Mat();
  let img_msk_gray = new cv.Mat();
  cv.cvtColor(img_tgt, img_tgt_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.cvtColor(img_tmpl, img_tmpl_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.cvtColor(img_msk, img_msk_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.matchTemplate(img_tgt_gray, img_tmpl_gray, dst, cv.TM_CCOEFF_NORMED, img_msk_gray);
  out = cv.minMaxLoc(dst);
  dst.delete();
  img_tgt_gray.delete();
  img_tmpl_gray.delete();
  img_msk_gray.delete();
  return out;
}
function gene_common_msk(img_tmpl, img_tgt) {
  let tmp_diff = new cv.Mat();
  let img_0_gray = img_tmpl.clone();
  let img_1_gray = img_tgt.clone();
  cv.cvtColor(img_0_gray, img_0_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.cvtColor(img_1_gray, img_1_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.absdiff(img_0_gray, img_1_gray, tmp_diff);
  cv.threshold(tmp_diff, tmp_diff, 0, 255, cv.THRESH_BINARY);
  cv.cvtColor(tmp_diff, tmp_diff, cv.COLOR_GRAY2RGB, 0);

  // let img_msk = cv.Mat.zeros(img_0_gray.rows, img_0_gray.cols, cv.CV_8UC3);
  // for (let i = 0; i < img_0_gray.rows; i++) {
  //   for (let j = 0; j < img_0_gray.cols; j++) {
  //     if (tmp_diff.ucharAt(i, j) > 0) {
  //       img_msk.ucharPtr(i, j)[0] = 255;
  //       img_msk.ucharPtr(i, j)[1] = 255;
  //       img_msk.ucharPtr(i, j)[2] = 255;
  //     }
  //   }
  // }
  // tmp_diff.delete();
  img_0_gray.delete();
  img_1_gray.delete();
  return tmp_diff;
}
function smoothing_list(l, window_size) {
  let out = [];
  for (let i = 0; i < l.length - window_size + 1; i++) {
    out.push(l.slice(i, i + window_size).reduce((sum, e) => sum + e, 0) / window_size);
  };
  return out;
}
function detect_common_scroll_area(l, l_smooth, window_size, mode_xy) {
  let tmp_v1 = l_smooth.findIndex(e => e > thres_common_diff_y1);
  if (tmp_v1 != -1) {
    tmp_v1 = l.findIndex((e, i) => i >= tmp_v1 && e > thres_common_diff_y1);
  }
  let tmp_v2 = l_smooth.findLastIndex(e => e > thres_common_diff_y2);
  if (tmp_v2 != -1) {
    tmp_v2 = l.findLastIndex((e, i) =>
      i <= tmp_v2 + window_size &&
      // e > thres_common_diff_y2);
      e > thres_common_diff_y2 && (
        // x軸を判定する時は追加条件なし
        (mode_xy == 'x') ||
        // y軸を判定する時はbottom_rowで参照される範囲に固定表示エリアがない
        (mode_xy == 'y' && l_smooth.slice(i - Math.floor((i - tmp_v1) / 16), i).filter(f => f <= thres_common_diff_y2).length == 0)
      )
    );
  }
  return {'v1': tmp_v1, 'v2': tmp_v2}
}
function detect_scroll_bar_position(obj, l_smooth) {
  let tmp_y1 = l_smooth.findIndex(e => e < thres_scroll_bar_position);
  let tmp_y2 = l_smooth.findLastIndex(e => e < thres_scroll_bar_position);
  obj['scroll_bar_y'] = Math.floor((tmp_y1 + tmp_y2) / 2)
  obj['scroll_bar_h'] = Math.abs(tmp_y2 - tmp_y1)
}
function detect_rects(img_in) {
  let mv_contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  let mv_contours_only_large = new cv.MatVector();
  let rayout_type = 'none';
  let rects = {};

  // Canny法でエッジ検出
  let img_gray = img_in.clone();
  cv.cvtColor(img_gray, img_gray, cv.COLOR_RGBA2GRAY, 0);
  cv.Canny(img_gray, img_gray, 50, 200, 3);
  let img_gray_half = img_gray.roi(new cv.Rect(0, Math.floor(img_in.rows / 2), img_in.cols, img_in.rows - Math.floor(img_in.rows / 2)));

  // 入力画像で輪郭抽出
  cv.findContours(img_gray_half, mv_contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point(0, Math.floor(img_in.rows / 2)));
  // 小さい輪郭は除外して再格納
  for (let i = 0; i < mv_contours.size(); i++) {
    if (cv.contourArea(mv_contours.get(i)) > (Math.min(img_gray_half.cols, img_gray_half.rows) ** 2) / 80) {
      mv_contours_only_large.push_back(mv_contours.get(i));
      // console.log(cv.contourArea(mv_contours.get(i)), (Math.min(img_gray_half.cols, img_gray_half.rows) ** 2) / 80);
    }
  };
  img_gray.delete();

  // 二値化でエッジ検出
  img_gray = img_in.clone();
  cv.cvtColor(img_gray, img_gray, cv.COLOR_RGBA2GRAY, 0);
  let ksize = new cv.Size(5, 5);
  cv.GaussianBlur(img_gray, img_gray, ksize, 0, 0, cv.BORDER_DEFAULT);
  cv.threshold(img_gray, img_gray, thres_gray, 255, cv.THRESH_BINARY);
  img_gray_half = img_gray.roi(new cv.Rect(0, Math.floor(img_in.rows / 2), img_in.cols, img_in.rows - Math.floor(img_in.rows / 2)));

  // 入力画像で輪郭抽出
  cv.findContours(img_gray_half, mv_contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point(0, Math.floor(img_in.rows / 2)));
  // 小さい輪郭は除外して再格納
  for (let i = 0; i < mv_contours.size(); i++) {
    if (cv.contourArea(mv_contours.get(i)) > (Math.min(img_gray_half.cols, img_gray_half.rows) ** 2) / 80) {
      mv_contours_only_large.push_back(mv_contours.get(i));
      // console.log(cv.contourArea(mv_contours.get(i)), (Math.min(img_gray_half.cols, img_gray_half.rows) ** 2) / 80);
    }
  };

  // console.log(mv_contours.size(), mv_contours_only_large.size());
  if (mv_contours_only_large.size() == 0) {
    throw new Error('閉じるボタンが検出出来ない画像があります。');
  };

  // 閉じるボタンテンプレ読み込み
  let tmpl_gray = cv.imread(document.getElementById('tmplClose'));
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
    if (cv.contourArea(mv_tmpl_contours.get(i)) > (Math.min(tmpl_gray.cols, tmpl_gray.rows) ** 2) / 80) {
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
    if (!only_matched) {
      cont_out.push(mv_contours_only_large.get(i));
      info_out.push({
        'index': i,
        'is_close': is_close_val < thres_cont_close,
        'is_close_val': is_close_val
      });
    } else if (is_close_val < thres_cont_close && is_close_val < min_is_close_val) {
      let tmp_rect = cv.boundingRect(mv_contours_only_large.get(i));
      if (tmp_rect.width > tmp_rect.height) {
        // 類似度がしきい値より高いかつ現時点最高かつ横長ならリスト更新
        cont_out.shift();
        info_out.shift();
        cont_out.push(mv_contours_only_large.get(i));
        info_out.push({
          'index': i,
          'is_close': true,
          'is_close_val': is_close_val
        });
        min_is_close_val = is_close_val;
      }
    }
  };
  if (cont_out.length == 0) {
    // 汎用連結処理に回すためレイアウトタイプ=unknownで終了
    rayout_type = 'unknown';
    // throw new Error('閉じるボタンが正常に検出出来ない画像があります。');
  } else {
    // console.log('rect_close_area', cv.contourArea(cont_out[0]));
    let rect_close = cv.boundingRect(cont_out[0]);
    // 閉じるが横にズレていた時のため座標をセンタリング
    // rect_close.x = Math.round(img_in.cols / 2 - rect_close.width / 2);
    // 一度wholeの枠座標を計算
    let rect_whole = calc_rects(rect_close, {'whole': rect_prop.whole, 'close': rect_prop.close});
    // console.log(rect_close);
    // console.log(rect_whole);

    // ヘッダー部分がどのyから始まってるか調査
    let y_start = Math.max(0, Math.floor(rect_whole.whole.y - rect_whole.whole.height / 20));
    let tmp_rect = new cv.Rect(rect_whole.whole.x, y_start, rect_whole.whole.width, Math.floor(rect_whole.whole.height / 10));
    if (tmp_rect.y + tmp_rect.height > img_in.rows || tmp_rect.x + tmp_rect.width > img_in.cols || tmp_rect.x < 0 || tmp_rect.y < 0) {
      // 汎用連結処理に回すためレイアウトタイプ=unknownで終了
      rayout_type = 'unknown';
      // throw new Error('閉じるボタンが正しく検出出来ない画像があります。');
    } else {
      let img_find_header = img_in.roi(new cv.Rect(rect_whole.whole.x, y_start, rect_whole.whole.width, Math.floor(rect_whole.whole.height / 10))).clone();
      cv.cvtColor(img_find_header, img_find_header, cv.COLOR_RGB2HSV, 0);
      let green = new cv.Mat();
      // ヘッダー辺りで緑っぽいピクセルを抽出
      cv.inRange(
        img_find_header,
        new cv.Mat(img_find_header.rows, img_find_header.cols, img_find_header.type(), [20, 150, 0, 0]),
        new cv.Mat(img_find_header.rows, img_find_header.cols, img_find_header.type(), [60, 255, 255, 0]),
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
      // console.log(rect_close);
      rect_close = {
        'x': rect_close.x + (rect_close.width * (1 - act_rate)) / 2,
        'y': rect_close.y + (rect_close.height * (1 - act_rate)) / 2,
        'width': rect_close.width * act_rate,
        'height': rect_close.height * act_rate,
      };
      // console.log(rect_close);
      // 枠座標を再計算
      let rects_base = calc_rects(rect_close, rect_prop);
      // レイアウトを取得
      let arr_rayout_score = [];

      let img_tgt = new cv.Mat();
      let img_tmpl = new cv.Mat();
      let tmp_dst = new cv.Mat();

      // 着順表かチェック
      // レイアウト毎にスコアを算出
      img_tgt = img_in.roi(new cv.Rect(Math.max(rects_base.header_text_result_table.x - 2, 0), Math.max(rects_base.header_text_result_table.y - 2, 0), rects_base.header_text_result_table.width + 4, rects_base.header_text_result_table.height + 4));
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextResultTable'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_result_table.width, rects_base.header_text_result_table.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'result_table', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // チムレスコア情報かチェック
      img_tgt = img_in.roi(new cv.Rect(Math.max(rects_base.header_text_score_info.x - 2, 0), Math.max(rects_base.header_text_score_info.y - 2, 0), rects_base.header_text_score_info.width + 4, rects_base.header_text_score_info.height + 4));
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextScoreInfo'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_score_info.width, rects_base.header_text_score_info.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'score_info', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // ウマ娘詳細かチェック
      // チムレスコア情報とターゲット画像の座標が同じなのでimg_tgtの生成は省略
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextUmaDetail'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_score_detail.width, rects_base.header_text_score_detail.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'uma_detail', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // チムレスコア詳細かチェック
      // スコア情報とターゲット画像の座標が同じなのでimg_tgtの生成は省略
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextScoreDetail'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_score_detail.width, rects_base.header_text_score_detail.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'score_detail', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // 出走ウマ娘かチェック
      // スコア情報とターゲット画像の座標が同じなのでimg_tgtの生成は省略
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextField'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_field.width, rects_base.header_text_field.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'field', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // レース詳細かチェック
      // スコア情報とターゲット画像の座標が同じなのでimg_tgtの生成は省略
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextRaceDetail'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_race_detail.width, rects_base.header_text_race_detail.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'race_detail', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // 号外かチェック
      // スコア情報とターゲット画像の座標が同じなのでimg_tgtの生成は省略
      img_tgt = img_in.roi(new cv.Rect(Math.max(rects_base.header_text_gougai.x - 2, 0), Math.max(rects_base.header_text_gougai.y - 2, 0), rects_base.header_text_gougai.width + 4, rects_base.header_text_gougai.height + 4));
      img_tmpl = cv.imread(document.getElementById('tmplHeaderTextGougai'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.header_text_gougai.width, rects_base.header_text_gougai.height), 0, 0);
      arr_rayout_score.push({'rayout_type': 'gougai', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

      // 最もスコアの高いレイアウトを選択、しきい値より高ければ採用
      arr_rayout_score.sort((a, b) => b.score - a.score);
      if (arr_rayout_score[0].score > thres_match_tmpl_rayout_type) {
        rayout_type = arr_rayout_score[0].rayout_type;
      } else {
        // 汎用連結処理に回すためレイアウトタイプ=unknownで終了
        rayout_type = 'unknown';
      }

      if (rayout_type == 'uma_detail') {
        // ウマ娘詳細画面の中でレイアウト特定
        arr_rayout_score = [];

        // 成長率付きかチェック
        let img_tgt = img_in.roi(new cv.Rect(rects_base.growth_rate.x - 2, rects_base.growth_rate.y - 2, rects_base.growth_rate.width + 4, rects_base.growth_rate.height + 4));
        let img_tmpl = cv.imread(document.getElementById('tmplGrowthRate'));
        cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
        let tmp_dst = new cv.Mat();
        cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.growth_rate.width, rects_base.growth_rate.height), 0, 0);
        arr_rayout_score.push({'rayout_type': 'with_growth_rate', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

        // パートナー登録ボタン付きかチェック
        img_tgt = img_in.roi(new cv.Rect(rects_base.register_partner.x - 2, rects_base.register_partner.y - 2, rects_base.register_partner.width + 4, rects_base.register_partner.height + 4));
        img_tmpl = cv.imread(document.getElementById('tmplRegisterPartner'));
        cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
        tmp_dst = new cv.Mat();
        cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.register_partner.width, rects_base.register_partner.height), 0, 0);
        arr_rayout_score.push({'rayout_type': 'with_register_partner', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

        // パートナー解除ボタン付きかチェック
        // パートナー登録とターゲット画像の座標が同じなのでimg_tgtの生成は省略
        img_tmpl = cv.imread(document.getElementById('tmplUnregisterPartner'));
        cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
        tmp_dst = new cv.Mat();
        cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.register_partner.width, rects_base.register_partner.height), 0, 0);
        arr_rayout_score.push({'rayout_type': 'with_unregister_partner', 'score': match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal});

        // 最もスコアの高いレイアウトを選択、しきい値より高ければ採用
        arr_rayout_score.sort((a, b) => b.score - a.score);
        if (arr_rayout_score[0].score > thres_match_tmpl_rayout_type) {
          // パートナー解除ボタン付きはパートナー登録ボタン付きとレイアウト同じなので読み替え
          rayout_type = arr_rayout_score[0].rayout_type;
          if (rayout_type == 'with_unregister_partner') {
            rayout_type = 'with_register_partner';
          }
        } else {
          rayout_type = 'normal';
        }
      }
      img_tgt.delete();
      img_tmpl.delete();
      tmp_dst.delete();
      img_find_header.delete();
      green.delete();

      if (rayout_type != 'unknown') {
        let rect_prop_added = add_rect_prop(rect_prop, rect_prop_dynamic, rayout_type);
        rects = calc_rects(rect_close, rect_prop_added);
        // console.log(rayout_type);
        // console.log(rects);
        // console.log(rects.whole);
        if (!(
          0 <= rects.whole.x &&
          0 <= rects.whole.y &&
          rects.whole.x + rects.whole.width <= img_in.cols &&
          rects.whole.y + rects.whole.height <= img_in.rows)) {
        throw new Error('ウマ娘詳細エリアが正しく検出出来ない画像があります。');
        }
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
      }
    }
  }


  // メモリ解放
  img_gray.delete();
  img_gray_half.delete();
  mv_contours.delete();
  hierarchy.delete();
  mv_contours_only_large.delete();
  tmpl_gray.delete();
  mv_tmpl_contours.delete();
  tmpl_hierarchy.delete();
  cont_out.forEach(function(c){c.delete()});
  l_tmpl_contours_only_large.forEach(function(c){c.delete()});
  return {'rayout_type': rayout_type, 'rects': rects};
}
function get_rects(l_mat) {
  return new Promise(function(resolve){
    const n_tgt = l_mat.length;
    console.log('閉じるボタン位置取得');
    console.log('枚数:', l_mat.length, '1枚目のheight,width:', l_mat[0].rows, l_mat[0].cols);
    let l_rects = [];
    let tmp_rects = {};
    for (let i = 0; i < l_mat.length; i++) {
      // 画像毎に閉じるボタンの検出と枠座標取得
      tmp_rects = detect_rects(l_mat[i]);
      l_rects.push(tmp_rects);
    }
    resolve(l_rects);
  })
}
function get_unknown_rects(l_mat, l_rects) {
  return new Promise(function(resolve){
    console.log('レイアウト不明画像について汎用処理でスクロール範囲特定');
    let l_index_tgt = [...Array(l_rects.length).keys()].filter((e) => l_rects[e].rayout_type == 'unknown')
    console.log(l_index_tgt);
    // 画像中央の16:9部分だけ切り出しは廃止
    // let tmp_w = Math.min(l_mat[l_index_tgt[0]].cols, Math.floor(l_mat[l_index_tgt[0]].rows / 16 * 9));
    if (l_index_tgt.length == 1) {
      // unknownが1枚だけなら全面スクロール範囲扱いで枠座標出力
      l_rects[l_index_tgt[0]].rayout_type = 'common_1picture';
      l_rects[l_index_tgt[0]].rects.scroll_full_width = {
        'x': 0,
        'y': 0,
        'width': l_mat[l_index_tgt[0]].cols,
        'height': l_mat[l_index_tgt[0]].rows
      };
    } else {
      // unknownが2枚以上のとき
      if (!(Math.min(...l_index_tgt.map((d) => {return l_mat[d].cols})) == Math.max(...l_index_tgt.map((d) => {return l_mat[d].cols})) &&
          Math.min(...l_index_tgt.map((d) => {return l_mat[d].rows})) == Math.max(...l_index_tgt.map((d) => {return l_mat[d].rows})))) {
        throw new Error('取り込み画像の解像度が一致していません。');
      }
      let img_0_gray = l_mat[l_index_tgt[0]].clone();
      cv.cvtColor(img_0_gray, img_0_gray, cv.COLOR_RGBA2GRAY, 0);
      let img_i_gray = new cv.Mat();
      let tmp_diff = new cv.Mat();
      let tmp_y1 = img_0_gray.rows;
      let tmp_y2 = 0;
      let tmp_x1 = img_0_gray.cols;
      let tmp_x2 = 0;
      let tmp_sum = 0;
      l_index_tgt.slice(1).forEach(function(i){
        // 2枚目以降を1枚目と比較し差分範囲を取得
        tmp_diff = new cv.Mat();
        img_i_gray = l_mat[i].clone();
        cv.cvtColor(img_i_gray, img_i_gray, cv.COLOR_RGBA2GRAY, 0);
        cv.absdiff(img_0_gray, img_i_gray, tmp_diff);

        // 一列毎に差異を合計
        let l_sum_diff_by_x = [];
        for (let i = 0; i < tmp_diff.cols; i++) {
          tmp_sum = 0;
          // 画像全体を検証
          for (let j = 0; j < tmp_diff.rows; j++) {
            // ucharAtは1px毎に0~255で出力
            tmp_sum += tmp_diff.ucharAt(i, j);
          }
          // heightで割って標準化
          l_sum_diff_by_x.push(tmp_sum / tmp_diff.rows);
        }
        // 結果の平滑化
        let l_sum_diff_by_x_smooth = smoothing_list(l_sum_diff_by_x, diff_window_size);
        // console.log(l_sum_diff_by_x.join('\n'));
        // console.log(l_sum_diff_by_x.map((e, i) => e + '\t' + l_sum_diff_by_x_smooth[Math.min(i, l_sum_diff_by_x_smooth.length - 1)]).join('\n'));
        // console.log(l_sum_diff_by_x_smooth.join('\n'));
        // 平滑化した結果を参考に外れ値を除外しつつスクロール範囲をぴったり検索
        let tmp_area_x = detect_common_scroll_area(l_sum_diff_by_x, l_sum_diff_by_x_smooth, diff_window_size, 'x');
        // console.log(tmp_area);
        if (tmp_area_x.v1 != -1) {
          // スクロール範囲が見つかったら上書き、見つからなければ完全一致画像として何もしない
          tmp_x1 = Math.min(tmp_x1, tmp_area_x.v1);
          tmp_x2 = Math.max(tmp_x2, tmp_area_x.v2);
        }

        // 一行毎に差異を合計
        let l_sum_diff_by_y = [];
        for (let i = 0; i < tmp_diff.rows; i++) {
          tmp_sum = 0;
          // 前段で特定した幅で検証
          for (let j = tmp_x1; j < tmp_x2; j++) {
            // ucharAtは1px毎に0~255で出力
            tmp_sum += tmp_diff.ucharAt(i, j);
          }
          // widthで割って標準化
          l_sum_diff_by_y.push(tmp_sum / (tmp_x2 - tmp_x1));
        }
        // 結果の平滑化
        let l_sum_diff_by_y_smooth = smoothing_list(l_sum_diff_by_y, diff_window_size);
        // console.log(l_sum_diff_by_y.join('\n'));
        console.log(l_sum_diff_by_y.map((e, i) => e + '\t' + l_sum_diff_by_y_smooth[Math.min(i, l_sum_diff_by_y_smooth.length - 1)]).join('\n'));
        // console.log(l_sum_diff_by_y_smooth.join('\n'));
        // 平滑化した結果を参考に外れ値を除外しつつスクロール範囲をぴったり検索
        let tmp_area = detect_common_scroll_area(l_sum_diff_by_y, l_sum_diff_by_y_smooth, diff_window_size, 'y');
        // console.log(tmp_area);
        if (tmp_area.v1 != -1) {
          // スクロール範囲が見つかったら上書き、見つからなければ完全一致画像として何もしない
          tmp_y1 = Math.min(tmp_y1, tmp_area.v1);
          tmp_y2 = Math.max(tmp_y2, tmp_area.v2);
        }
      })
      console.log(tmp_x1, tmp_x2, tmp_y1, tmp_y2);

      // 全部のunknown画像で一番広いスクロール範囲を採用して各画像のrectsを生成
      l_index_tgt.forEach(function(i){
        if (tmp_y1 == 0) {
          l_rects[i].rayout_type = 'common_scroll_only';
        } else {
          l_rects[i].rayout_type = 'common_header_scroll';
          l_rects[i].rects.header = {
            'x': tmp_x1,
            'y': 0,
            'width': tmp_x2 - tmp_x1,
            'height': tmp_y1
          };
        }
        l_rects[i].rects.scroll_full_width = {
          'x': tmp_x1,
          'y': tmp_y1,
          'width': tmp_x2 - tmp_x1,
          'height': tmp_y2 - tmp_y1
        };
        // フッターはスクロール部の下全部
        l_rects[i].rects.footer = {
          'x': tmp_x1,
          'y': tmp_y2,
          'width': tmp_x2 - tmp_x1,
          'height': l_mat[i].rows - tmp_y2
        };
      })

      img_0_gray.delete();
      img_i_gray.delete();
      tmp_diff.delete();
    }
    // scroll_full_width以外を生成
    l_index_tgt.forEach(function(i){
      // scrollはscroll_full_widthと同じ扱い
      l_rects[i].rects.scroll = l_rects[i].rects.scroll_full_width;
      // bottom_rowは全体の下部1/8
      l_rects[i].rects.bottom_row = {
        'x': l_rects[i].rects.scroll_full_width.x,
        'y': l_rects[i].rects.scroll_full_width.y + l_rects[i].rects.scroll_full_width.height - Math.floor(l_rects[i].rects.scroll_full_width.height / 8),
        'width': l_rects[i].rects.scroll_full_width.width,
        'height': Math.floor(l_rects[i].rects.scroll_full_width.height / 8)
      };
      // bottom_row_higherは全体の下部1/4
      l_rects[i].rects.bottom_row_higher = {
        'x': l_rects[i].rects.scroll_full_width.x,
        'y': l_rects[i].rects.scroll_full_width.y + l_rects[i].rects.scroll_full_width.height - Math.floor(l_rects[i].rects.scroll_full_width.height / 4),
        'width': l_rects[i].rects.scroll_full_width.width,
        'height': Math.floor(l_rects[i].rects.scroll_full_width.height / 4)
      };
    })
    resolve();
  })
}
function trim_parts(l_mat, l_rects) {
  return new Promise(function(resolve){
    console.log('閉じるボタンを基準に各パーツ切り出し');
    const n_tgt = l_mat.length;
    // レイアウトxパーツ毎の最小サイズを算出
    let tgt_sizes = {};
    // console.log(l_rects);
    all_rayout_type.forEach(function(r){
      if (l_rects.filter((e) => e.rayout_type == r).length > 0) {
        tgt_sizes[r] = {};
        load_parts_by_rayout_type[r].forEach(function(p){
          // console.log(r, p)
          let tmp_w = Math.min(...l_rects.filter((e) => e.rayout_type == r).map((d) => {return d.rects[p].width}));
          let tmp_h = Math.min(...l_rects.filter((e) => e.rayout_type == r).map((d) => {return d.rects[p].height}));
          tgt_sizes[r][p] = {'width': tmp_w, 'height': tmp_h};
        })
      }
    });
    // 最小サイズに合わせて全パーツを切り出し
    let imgs = [];
    l_mat.forEach(function(m, i){
      let obj_tmp = {};
      let tgt_load_parts = load_parts_by_rayout_type[l_rects[i].rayout_type];
      tgt_load_parts.forEach(function(p){
        let tmp_mat = new cv.Mat();
        let tmp_dst = new cv.Mat();
        // console.log(Object.keys(l_rects[i].rects));
        tmp_mat = m.roi(l_rects[i].rects[p]).clone();
        cv.resize(tmp_mat, tmp_dst, tgt_sizes[l_rects[i].rayout_type][p]);
        obj_tmp[p] = tmp_dst.clone();
        tmp_mat.delete();
        tmp_dst.delete();
      });
      obj_tmp['rayout_type'] = l_rects[i].rayout_type;
      // スクロールバーがあればそれの高さを取得
      if (tgt_load_parts.includes('scroll_bar')) {
        // console.log(l_rects[i].rects['scroll_bar']);
        img_scroll_bar_gray = obj_tmp['scroll_bar'].clone();
        cv.cvtColor(img_scroll_bar_gray, img_scroll_bar_gray, cv.COLOR_RGBA2GRAY, 0);

        let l_sum_val_by_y = [];
        for (let i = 0; i < img_scroll_bar_gray.rows; i++) {
          tmp_sum = 0;
          for (let j = 0; j < img_scroll_bar_gray.cols; j++) {
            // ucharAtは1px毎に0~255で出力
            tmp_sum += img_scroll_bar_gray.ucharAt(i, j);
          }
          l_sum_val_by_y.push(tmp_sum / img_scroll_bar_gray.cols);
        }
        img_scroll_bar_gray.delete();
        // スクロールバーの中央と長さを取得して格納
        detect_scroll_bar_position(obj_tmp, l_sum_val_by_y);
      }
      imgs.push(obj_tmp);
    });
    resolve(imgs);
  })
}
function get_group_list(imgs, l_rects) {
  return new Promise(function(resolve){
    const n_tgt = imgs.length;
    // グループ決め
    let l_group = [];
    if (force_one_group) {
      // 強制的に全画像同じグループ扱い
      l_group = Array(n_tgt).fill(0);
    } else {
      // グループ番号をnullで初期化
      l_group = Array(n_tgt).fill(null);
      // 各画像の組み合わせ毎の一致度を格納する二次元配列宣言
      // 似てると1、似てないと0なので1.0で初期化
      let arr_val = new Array(n_tgt);
      for(let y = 0; y < n_tgt; y++) {
        arr_val[y] = new Array(n_tgt).fill(1.0);
      }
      // アイコン等からグループ決め
      // 全組み合わせでテンプレートマッチ
      imgs.forEach(function(img_tmpl, i){
        imgs.forEach(function(img_tgt, j){
          // 同じ組み合わせで二回チェックしないようjの方が大きい時
          // かつ両者のレイアウトタイプが一致する時だけチェック
          // i == jの時は同じ画像同士=100%一致なので無視
          if (i < j) {
            if (l_rects[i].rayout_type != l_rects[j].rayout_type) {
              // レイアウトタイプが異なっていたら100%別グループとして0を強制代入
              arr_val[Math.min(i, j)][Math.max(i, j)] = 0;
            } else if (['score_info', 'field', 'common_header_scroll'].includes(l_rects[i].rayout_type)) {
              // ヘッダーを持つレイアウトはヘッダーで比較
              ['header'].forEach(function(p){
                let res = match_tmpl_min_max_loc(img_tgt[p], img_tmpl[p].roi(new cv.Rect(0, 0, Math.max(img_tmpl[p].cols - 1, 1), Math.max(img_tmpl[p].rows - 1, 1))).clone());
                // パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
                arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal;
              });
            } else if (['result_table', 'score_detail', 'race_detail', 'gougai'].includes(l_rects[i].rayout_type)) {
              // 基本情報欄を持つレイアウトは基本情報欄で比較
              ['basic_info'].forEach(function(p){
                let res = match_tmpl_min_max_loc(img_tgt[p], img_tmpl[p].roi(new cv.Rect(0, 0, Math.max(img_tmpl[p].cols - 1, 1), Math.max(img_tmpl[p].rows - 1, 1))).clone());
                // パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
                arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal;
              });
            } else if (['common_scroll_only'].includes(l_rects[i].rayout_type)) {
              // スクロール範囲しかないものはレイアウトタイプが一致していれば強制的に100%同じグループとして1を強制代入
              arr_val[Math.min(i, j)][Math.max(i, j)] = 1;
            } else {
              // パーツ毎にテンプレートマッチ
              tgt_parts_for_group.forEach(function(p){
                let res = match_tmpl_min_max_loc(img_tgt[p], img_tmpl[p].roi(new cv.Rect(0, 0, Math.max(img_tmpl[p].cols - 1, 1), Math.max(img_tmpl[p].rows - 1, 1))).clone());
                // パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
                arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal;
              });
            }
          }
        })
      })
      console.log(arr_val);
      let current_group = -1;
      [...Array(n_tgt).keys()].forEach(function(i){
        if (l_group[i] == null) {
          current_group += 1;
          l_group[i] = current_group;
          for (let j = i + 1; j < n_tgt; j++) {
            if (l_group[j] == null && arr_val[i][j] > thres_match_tmpl_basic_info) {
              l_group[j] = current_group;
            }
          }
        }
      })
    };
    // console.log(l_group);
    resolve(l_group);
  })
}
function get_order_by_scbar(imgs, l_rects, l_group) {
  return new Promise(function(resolve){
    const n_tgt = imgs.length;
    // グループ毎に処理
    [...Array(Math.max(...l_group) + 1).keys()].forEach(function(current_group){
      let l_tmp_scbar_y = [];
      let l_tmp_scbar_h = [];
      let n_tmp = 0;
      imgs.forEach(function(img_tgt, i){
        if (l_group[i] == current_group) {
          n_tmp += 1;
          if ('scroll_bar_y' in img_tgt) {
            if (img_tgt['scroll_bar_y'] != -1) {
              l_tmp_scbar_y.push({'index': i, 'scroll_bar_y': img_tgt['scroll_bar_y']})
              l_tmp_scbar_h.push(img_tgt['scroll_bar_h'])
            }
          } else {
            img_tgt['scroll_bar_y'] = -1
            img_tgt['scroll_bar_h'] = -1
          }
        }
      })

      // スクロールバーの位置が不明な画像が一つでもあれば全部ポジション不明扱い
      // またはスクロールバーの長さがそこそこ一致してないと全部ポジション不明扱い
      // console.log(l_tmp_scbar_y);
      // console.log(l_tmp_scbar_h);
      if (n_tmp != l_tmp_scbar_y.length || Math.min(...l_tmp_scbar_h) / Math.max(...l_tmp_scbar_h) < thres_scbar_h) {
        imgs.forEach(function(img_tgt, i){
          if (l_group[i] == current_group) {
            img_tgt['position_by_scbar'] = -1
          }
        })
      } else {
        // ソートして順序をimgsに返す
        l_tmp_scbar_y.sort((first, second) => first['scroll_bar_y'] - second['scroll_bar_y']);
        l_tmp_scbar_y.forEach(function(tmp_scbar_y, i){
          imgs[tmp_scbar_y['index']]['position_by_scbar'] = i
        })
      }
    })

    // console.log(l_order_by_scbar_by_group);
    resolve();
  })
}
function match_one_line(imgs, l_group, arr_val, arr_loc, i) {
  return new Promise(function(resolve){
    let img_tmpl = imgs[i];
    let simple_rayout = ['result_table', 'score_info', 'score_detail', 'field', 'race_detail', 'gougai'];
    imgs.forEach(function(img_tgt, j){
      let is_neighbor_by_scbar = false;
      let is_tgt = false;
      // 同じ画像ではなく、かつ同じグループであり、スクロールバーに基づく順序があるならそれが隣接していたら比較開始
      if (i != j && l_group[i] == l_group[j]) {
        is_tgt = true;
        if (img_tmpl['position_by_scbar'] != -1) {
          if (img_tgt['position_by_scbar'] == img_tmpl['position_by_scbar'] + 1) {
            is_neighbor_by_scbar = true;
          }
        }
      }
      // console.log(i, j, is_tgt, is_neighbor_by_scbar, is_tgt && (img_tmpl['position_by_scbar'] == -1 || is_neighbor_by_scbar))
      if (is_tgt && (img_tmpl['position_by_scbar'] == -1 || is_neighbor_by_scbar)) {
        let res = {};
        let tmp_sign = 0;
        if (simple_rayout.includes(img_tmpl.rayout_type)) {
          // シンプルレイアウトなら比較範囲を拡大
          res = match_tmpl_min_max_loc(img_tgt.scroll, img_tmpl.bottom_row_higher);
        } else if (['common_header_scroll', 'common_scroll_only'].includes(img_tmpl.rayout_type)) {
          // 汎用レイアウトならマスクを用いて比較
          let img_msk = gene_common_msk(img_tmpl.bottom_row, img_tgt.bottom_row);
          res = match_tmpl_with_msk_min_max_loc(img_tgt.scroll, img_tmpl.bottom_row, img_msk);
          img_msk.delete();
        } else {
          res = match_tmpl_min_max_loc(img_tgt.scroll, img_tmpl.bottom_row);
        }
        // 1行分の範囲でヒットしたら重なってるはずのエリアで改めてヒットするか確認
        if (arr_val[Math.min(i, j)][Math.max(i, j)] < res.maxVal && thres_match_tmpl < res.maxVal) {
          // console.log(i, j);
          let dist = 0;
          if (simple_rayout.includes(img_tmpl.rayout_type)) {
            dist = img_tgt.scroll.rows - img_tmpl.bottom_row_higher.rows - res.maxLoc.y;
          } else {
            dist = img_tgt.scroll.rows - img_tmpl.bottom_row.rows - res.maxLoc.y;
          }
          let tmp_img_tgt = new cv.Mat();
          let tmp_img_tmpl = new cv.Mat();
          if (i >= j) {
            dist *= -1;
          }
          if (dist < 0) {
            tmp_sign = 1
          } else {
            tmp_sign = -1
          }
          tmp_img_tgt = img_tmpl.scroll.roi(new cv.Rect(0, dist * tmp_sign * -1, img_tmpl.scroll.cols, img_tmpl.scroll.rows + dist * tmp_sign)).clone();
          tmp_img_tmpl = img_tgt.scroll.roi(new cv.Rect(0, 0, img_tgt.scroll.cols, img_tgt.scroll.rows + dist * tmp_sign)).clone();

          let tmp_res = match_tmpl_min_max_loc(tmp_img_tgt, tmp_img_tmpl);
          // console.log(i, j, res.maxVal, tmp_res.maxVal, dist);
          if (thres_match_tmpl_higher < tmp_res.maxVal) {
            arr_val[Math.min(i, j)][Math.max(i, j)] = res.maxVal;
            arr_loc[Math.min(i, j)][Math.max(i, j)] = dist;
          }
          tmp_img_tmpl.delete();
          tmp_img_tgt.delete();
        }
        // もし隣接しているはずなのに相対距離が出てない、または上下逆に繋がってたら、真下に単純連結出来る距離を入力
        // console.log(is_neighbor_by_scbar, i, j, arr_val[Math.min(i, j)][Math.max(i, j)], arr_loc[Math.min(i, j)][Math.max(i, j)], arr_val[Math.min(i, j)][Math.max(i, j)] == 0.0)
        if (i <= j) {
          tmp_sign = 1;
        } else {
          tmp_sign = -1;
        }
        if (is_neighbor_by_scbar && (arr_val[Math.min(i, j)][Math.max(i, j)] == 0.0 || arr_loc[Math.min(i, j)][Math.max(i, j)] * tmp_sign < 0)) {
          raiseNormalMsg('スクロールバーの位置に基づいて単純連結している箇所があります。');
          arr_val[Math.min(i, j)][Math.max(i, j)] = 1.0;
          arr_loc[Math.min(i, j)][Math.max(i, j)] = img_tgt.scroll.rows * tmp_sign;
          // console.log(is_neighbor_by_scbar, i, j, arr_val[Math.min(i, j)][Math.max(i, j)], arr_loc[Math.min(i, j)][Math.max(i, j)])
        }
      }
    })
    resolve();
  })
}

// 2024/1/10 未使用
async function match_cross(imgs, l_group) {
    console.log('グループ内でテンプレートマッチ')
    const n_tgt = imgs.length;
    // グループ内でテンプレートマッチ
    // 結果格納用配列初期化
    let arr_val = new Array(n_tgt);
    for(let y = 0; y < n_tgt; y++) {
      arr_val[y] = new Array(n_tgt).fill(0.0);
    }
    let arr_loc = new Array(n_tgt);
    for(let y = 0; y < n_tgt; y++) {
      arr_loc[y] = new Array(n_tgt).fill(0.0);
    }
    for (let i = 0; i < imgs.length; i++) {
      // changePercentage(10 + i);
      console.log((i + 1) +  '/' + imgs.length);
      await match_one_line(imgs, l_group, arr_val, arr_loc, i);
      changePercentage(30 + i);
      await repaint();
    }
    // arr_val.forEach(function(r){console.log(r)});
    // arr_loc.forEach(function(r){console.log(r)});
    return [arr_val, arr_loc];
}
function get_relative_dist(arr_val, arr_loc, l_group) {
  return new Promise(function(resolve){
    const n_tgt = arr_val.length;
    console.log('各グループの先頭画像からの相対距離を算出')
    // 各グループの先頭画像からの相対距離を算出
    let l_relative_height = new Array(n_tgt).fill(null);
    let l_relative_height_score = new Array(n_tgt).fill(0.0);
    let l_isfinished = new Array(n_tgt).fill(false);
    let n_finished_before = -1;
    let n_finished = 0;
    // グループ毎に処理
    [...Array(Math.max(...l_group) + 1).keys()].forEach(function(current_group){
      let i_most_certain = 0;
      // 基準となる最も確実性の高いペアの上側の画像を探す
      let l_val = [];
      [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group).forEach(function(i){
        [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group).forEach(function(j){
          l_val.push({'i': i, 'j': j, 'val': arr_val[i][j], 'loc': arr_loc[i][j]});
        })
      })
      l_val.sort((first, second) => second['val'] - first['val']);
      if (l_val[0]['loc'] >= 0) {
        i_most_certain = l_val[0]['i'];
      } else {
        i_most_certain = l_val[0]['j'];
      }
      // console.log(i_most_certain);

      // 相対座標計算開始
      let is_group_initialized = false;
      while (true) {
        n_finished_before = n_finished;
        // 今のグループだけ処理
        [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group).forEach(function(y){
          // 基準画像までスキップ
          if (!is_group_initialized && y == i_most_certain) {
            l_relative_height[y] = 0;
            l_relative_height_score[y] = 1;
            is_group_initialized = true;
          }
          // 初期化されていてかつ相対座標が決まってたら、まだ決まってない他の画像に波及開始
          if (is_group_initialized && !l_isfinished[y] && l_relative_height[y] != null) {
            [...Array(n_tgt).keys()].forEach(function(i){
              [...Array(n_tgt).keys()].forEach(function(j){
                if (arr_loc[i][j] != 0 && l_group[i] == current_group && l_group[j] == current_group) {
                  let tmp_relative_height_score = Math.min(l_relative_height_score[y], arr_val[i][j]);
                  if (i < y && j == y && l_relative_height_score[i] < tmp_relative_height_score) {
                    l_relative_height[i] = l_relative_height[y] - arr_loc[i][j];
                    l_relative_height_score[i] = tmp_relative_height_score;
                    l_isfinished[i] = false;
                    // console.log([y, i, j, true, ...l_isfinished, ...l_relative_height, ...l_relative_height_score].join('\t'));
                  } else if (i == y && j > y && l_relative_height_score[j] < tmp_relative_height_score) {
                    l_relative_height[j] = l_relative_height[y] + arr_loc[i][j];
                    l_relative_height_score[j] = tmp_relative_height_score;
                    l_isfinished[j] = false;
                    // console.log([y, i, j, false, ...l_isfinished, ...l_relative_height, ...l_relative_height_score].join('\t'));
                  }
                }
              })
            })
            l_isfinished[y] = true
          }
        })
        // 全部チェックし終えたか更新出来なくなったら終了
        n_finished = l_isfinished.filter((d) => d).length;
        if (n_finished == n_tgt || n_finished_before == n_finished) {
          break;
        }
      }
      // 最も上の画像に対する相対座標に変換
      let min_relative_height = Math.min(...l_relative_height.filter((d, i) => l_group[i] == current_group));
      // console.log(l_relative_height, min_relative_height);
      for (let i = 0; i < l_relative_height.length; i++) {
        if(l_group[i] == current_group && l_relative_height[i] != null) {
          l_relative_height[i] -= min_relative_height;
        }
      }
    })
    console.log(l_relative_height);
    resolve(l_relative_height);
  })
}
function align_missing_imgs(l_relative_height, l_group, imgs) {
  return new Promise(function(resolve){
    // console.log(l_relative_height);
    const n_tgt = imgs.length;
    console.log('位置が取得出来なかった画像を末尾に単純配置');
    if (l_relative_height.filter((d) => d == null).length) {
      raiseNormalMsg('位置が取得出来ない画像があったため末尾に単純連結しています。二行ずつ重なるようにスクショを撮れているか確認して下さい。');
      // グループ毎に処理
      [...Array(Math.max(...l_group) + 1).keys()].forEach(function(current_group){
        let max_rh_already = Math.max(...l_relative_height.filter((d, i) => l_group[i] == current_group));
        let index_max_rh_already = [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group && l_relative_height[d] == max_rh_already)[0];
        console.log(max_rh_already, index_max_rh_already);
        let next_rh = max_rh_already + imgs[index_max_rh_already].scroll.rows;
        [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group && l_relative_height[d] == null).forEach(function(i){
          l_relative_height[i] = next_rh;
          next_rh += imgs[i].scroll.rows;
        })
      })
    }
    // console.log(l_relative_height);
    resolve(l_relative_height);
  })
}
function generateReceipt(imgs, l_group, l_relative_height) {
  return new Promise(function(resolve){
    const n_tgt = imgs.length;

    // グループ毎に縦に繋げて最後に横につなげる
    let imgs_tmp = [];
    [...Array(Math.max(...l_group) + 1).keys()].forEach(function(current_group){
      // 今のグループに属する画像のインデックス一覧を取得
      let l_index = [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group && l_relative_height[d] != null);
      // 相対座標が低い順にソート
      l_index.sort((first, second) => l_relative_height[first] - l_relative_height[second]);
      let imgs_part = new cv.MatVector();
      let is_header = true;
      let relative_height_before = 0;
      l_index.forEach(function(i){
        // 各グループの先頭はヘッダー部分付き
        if (is_header) {
          imgs_part.push_back(imgs[i].scroll_with_header);
          is_header = false;
          relative_height_before = l_relative_height[i];
        } else {
          let img_tmp = imgs[i].scroll_full_width;
          let y = Math.floor(imgs[i].scroll.rows - (l_relative_height[i] - relative_height_before));
          let tmp_rect = new cv.Rect(0, y, img_tmp.cols, img_tmp.rows - y);
          let img_tmp_part = img_tmp.roi(tmp_rect);
          imgs_part.push_back(img_tmp_part.clone());
          relative_height_before = l_relative_height[i];
          img_tmp_part.delete();
        }
      });
      // はぐれがいたら末尾にトリミングなしで追加
      if ([...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group && l_relative_height[d] == null).length > 0) {
        raiseNormalMsg('重なり方を検出出来ない画像があったため一部取り込み順に単純連結している箇所があります。');
        [...Array(n_tgt).keys()].filter((d) => l_group[d] == current_group && l_relative_height[d] == null).forEach(function(i){
          imgs_part.push_back(imgs[i].scroll_full_width);
        });
      }
      // 出力用配列に格納
      imgs_tmp.push(imgs_part.clone());
      // メモリ解放
      imgs_part.delete();
    });

    // 上下左右連結は外側で
    resolve(imgs_tmp);
  })
}
// 2024/1/19 未使用
function detectFactor(eles_scroll_canvas) {
  let l_scroll_canvas = Array.from(eles_scroll_canvas);
  const n_group = l_scroll_canvas.length;
  console.log(n_group);
  let l_out = [];
  // グループ毎に処理
  l_scroll_canvas.forEach((sc) => {
    let l_tmp = [];
    // 因子のまるポチとテキストの横方向の位置を取得
    let tmp_scale = sc.width / rect_prop.scroll[2];
    let l_rects = [
      {
        factor_disc: {
          x: Math.floor((rect_prop.factor_disc_left[0] - rect_prop.scroll[0]) * tmp_scale),
          y: 0,
          w: Math.floor(rect_prop.factor_disc_left[2] * tmp_scale),
          h: Math.floor(rect_prop.factor_disc_left[2] * tmp_scale)},
        factor_icon: {
          x: Math.floor((rect_prop.factor_icon_left[0] - rect_prop.scroll[0]) * tmp_scale),
          y: 0,
          w: Math.floor(rect_prop.factor_icon_left[2] * tmp_scale),
          h: Math.floor(rect_prop.factor_icon_left[3] * tmp_scale)},
        factor_text: {
          x: Math.floor((rect_prop.factor_text_left[0] - rect_prop.scroll[0]) * tmp_scale),
          y: 0,
          w: Math.floor(rect_prop.factor_text_left[2] * tmp_scale),
          h: Math.floor(rect_prop.factor_text_left[3] * tmp_scale)}
      },
      {
        factor_disc: {
          x: Math.floor((rect_prop.factor_disc_right[0] - rect_prop.scroll[0]) * tmp_scale),
          w: Math.floor(rect_prop.factor_disc_right[2] * tmp_scale)},
        factor_icon: {
          x: Math.floor((rect_prop.factor_icon_right[0] - rect_prop.scroll[0]) * tmp_scale),
          y: 0,
          w: Math.floor(rect_prop.factor_icon_right[2] * tmp_scale),
          h: Math.floor(rect_prop.factor_icon_right[3] * tmp_scale)},
        factor_text: {
          x: Math.floor((rect_prop.factor_text_right[0] - rect_prop.scroll[0]) * tmp_scale),
          y: 0,
          w: Math.floor(rect_prop.factor_text_right[2] * tmp_scale),
          h: Math.floor(rect_prop.factor_text_right[3] * tmp_scale)}
      }
    ];
    // Mat化
    let tmpImg = cv.imread(sc);
    // 1列目と2列目を順番に処理
    [...Array(2).keys()].forEach(lr => {
      let img_factor_discs = tmpImg.roi(new cv.Rect(
        l_rects[lr].factor_disc.x,
        0,
        l_rects[lr].factor_disc.w,
        tmpImg.rows)).clone();
      // 因子のまるポチのテンプレート読み込み
      let tmpl_factor_disc = cv.imread(document.getElementById('tmplFactorDisc'));
      cv.resize(tmpl_factor_disc, tmpl_factor_disc, new cv.Size(l_rects[lr].factor_disc.w, l_rects[lr].factor_disc.w), 0, 0, cv.INTER_CUBIC);
      // テンプレートマッチ
      let result = new cv.Mat();
      cv.matchTemplate(img_factor_discs, tmpl_factor_disc, result, cv.TM_CCOEFF_NORMED);
      // list化
      let l_res = [];
      [...Array(result.size().height).keys()].forEach(y => {
        l_res.push(result.floatPtr(y, 0)[0]);
      })
      // テンプレートマッチの結果からまるポチがあると思われる高さを抽出
      let l_peak = [];
      let thres_match_tmpl_disc_dynamic = Math.max(...l_res) * thres_match_tmpl_disc_rate;
      console.log(thres_match_tmpl_disc_dynamic);
      [...Array(l_res.length).keys()].forEach(y => {
        if (0 < y && y < l_res.length - 1) {
          if (l_res[y] > thres_match_tmpl_disc && l_res[y] > thres_match_tmpl_disc_dynamic && l_res[y - 1] < l_res[y] && l_res[y] > l_res[y + 1]) {
            l_peak.push({index: y, val: l_res[y]});
          }
        }
      })
      // 位置が近すぎる結果があったらより精度の高い結果のみ残す
      let l_peak_filtered = l_peak.filter((d) => Math.max(...l_peak.filter((e) => d.index - tmpl_factor_disc.rows <= e.index && e.index < d.index + tmpl_factor_disc.rows).map((e) => {return e.val})) == d.val);
      console.log(l_peak_filtered);
      // まるポチとテキストの座標算出
      l_peak_filtered.forEach(p => {
        l_tmp.push({
          rect_factor_disc: {
            left: l_rects[lr].factor_disc.x,
            top: p.index,
            width: l_rects[lr].factor_disc.w,
            height: l_rects[lr].factor_disc.h
          },
          // アイコンの座標は盾の中心がまるポチと同じになるように
          rect_factor_icon: {
            left: l_rects[lr].factor_icon.x,
            top: Math.floor(p.index + l_rects[lr].factor_disc.w / 2 - l_rects[lr].factor_icon.h / 2),
            width: l_rects[lr].factor_icon.w,
            height: l_rects[lr].factor_icon.h
          },
          rect_factor_text: {
            left: l_rects[lr].factor_text.x,
            top: p.index,
            width: l_rects[lr].factor_text.w,
            height: l_rects[lr].factor_text.h
          }
        })
      })
    })
    l_out.push(l_tmp);
    tmpImg.delete()
  })
  return l_out;
}
function gamma_correction(canvas_in, gamma_val) {
  let canvas_out = document.createElement('canvas');
  canvas_out.width = canvas_in.width;
  canvas_out.height = canvas_in.height;

  let ctx = canvas_in.getContext('2d');
  let c_src = ctx.getImageData(0, 0, canvas_in.width, canvas_in.height);
  let c_dst = ctx.createImageData(canvas_in.width, canvas_in.height);
  let int_g = 0.1;
  const correctify = val => 255 * Math.pow(val / 255, 1 / gamma_val);
  for (let i = 0; i < c_src.data.length; i += 4) {
    c_dst.data[i] = correctify(c_src.data[i]);
    c_dst.data[i + 1] = correctify(c_src.data[i + 1]);
    c_dst.data[i + 2] = correctify(c_src.data[i + 2]);
    c_dst.data[i + 3] = c_src.data[i + 3];
  }
  canvas_out.getContext('2d').putImageData(c_dst, 0, 0);
  return canvas_out;
}
function detectFactor_by_gamma(eles_scroll_canvas) {
  let l_out = [];
  // 因子1枠テンプレ画像読み込み
  let ele_tmpl_1factor = document.getElementById('tmpl1Factor');
  let canvas_tmpl_1factor = document.createElement('canvas');
  canvas_tmpl_1factor.width = ele_tmpl_1factor.naturalWidth;
  canvas_tmpl_1factor.height = ele_tmpl_1factor.naturalHeight;
  // テンプレ画像をキャンバスに書き込み
  canvas_tmpl_1factor.getContext('2d').drawImage(ele_tmpl_1factor, 0, 0);
  canvas_tmpl_1factor = gamma_correction(canvas_tmpl_1factor, 0.1);
  // テンプレ画像で特徴点検出
  let src_tmpl = cv.imread(canvas_tmpl_1factor);
  cv.cvtColor(src_tmpl, src_tmpl, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(src_tmpl, src_tmpl, thres_1factor, 255, cv.THRESH_BINARY);
  let mv_tmpl_contours = new cv.MatVector();
  let mv_tmpl_hierarchy = new cv.Mat();
  cv.findContours(src_tmpl, mv_tmpl_contours, mv_tmpl_hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
  // 小さい輪郭は除外して配列に再格納
  let l_tmpl_contours_only_large = [];
  for (let i = 0; i < mv_tmpl_contours.size(); i++) {
    if (cv.contourArea(mv_tmpl_contours.get(i)) > (Math.min(src_tmpl.cols, src_tmpl.rows) ** 2) / 50) {
      l_tmpl_contours_only_large.push(mv_tmpl_contours.get(i));
    }
  };
  // 大きい順に2番目のを因子1枠の輪郭として採用
  l_tmpl_contours_only_large.sort((first, second) => cv.contourArea(second) - cv.contourArea(first));
  let msk_1factor = l_tmpl_contours_only_large[1];
  mv_tmpl_contours.delete();
  mv_tmpl_hierarchy.delete();
  src_tmpl.delete();
  canvas_tmpl_1factor.remove();

  let l_scroll_canvas = Array.from(eles_scroll_canvas);
  // グループ毎に処理
  l_scroll_canvas.forEach((sc) => {
    let img_src = cv.imread(sc);
    let l_tmp = [];
    // ガンマ補正
    let tmpCanvasElement = gamma_correction(sc, 0.1);

    // ガンマ補正後のスクロール部を使って特徴点マッチング
    let img_src_gamma = cv.imread(tmpCanvasElement);
    cv.cvtColor(img_src_gamma, img_src_gamma, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(img_src_gamma, img_src_gamma, thres_1factor, 255, cv.THRESH_BINARY);
    let mv_contours = new cv.MatVector();
    let mv_hierarchy = new cv.Mat();
    cv.findContours(img_src_gamma, mv_contours, mv_hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    for (let i = 0; i < mv_contours.size(); ++i) {
      // 小さい領域は無視
      if (cv.contourArea(mv_contours.get(i)) > (Math.min(img_src_gamma.cols, img_src_gamma.rows) ** 2) / 50) {
        is_close_val = cv.matchShapes(mv_contours.get(i), msk_1factor, cv.CONTOURS_MATCH_I3, 0);
        if (is_close_val < thres_cont_close) {
          let tmp_rect = cv.boundingRect(mv_contours.get(i));
          let tmp_scale = tmp_rect.width / rect_prop.factor_area_left[2];
          let tmp_dic = {
            rect_factor_disc: {
              left: tmp_rect.x + Math.floor((rect_prop.factor_disc_left[0] - rect_prop.factor_area_left[0]) * tmp_scale),
              top: tmp_rect.y + Math.floor((rect_prop.factor_disc_left[1] - rect_prop.factor_area_left[1]) * tmp_scale),
              width: Math.floor(rect_prop.factor_disc_left[2] * tmp_scale),
              height: Math.floor(rect_prop.factor_disc_left[3] * tmp_scale)
            },
            // アイコンの座標は盾の中心がまるポチと同じになるように
            rect_factor_icon: {
              left: tmp_rect.x + Math.floor((rect_prop.factor_icon_left[0] - rect_prop.factor_area_left[0]) * tmp_scale),
              top: tmp_rect.y + Math.floor((rect_prop.factor_icon_left[1] - rect_prop.factor_area_left[1]) * tmp_scale),
              width: Math.floor(rect_prop.factor_icon_left[2] * tmp_scale),
              height: Math.floor(rect_prop.factor_icon_left[3] * tmp_scale)
            },
            rect_factor_text: {
              left: tmp_rect.x + Math.floor((rect_prop.factor_text_left[0] - rect_prop.factor_area_left[0]) * tmp_scale),
              top: tmp_rect.y + Math.floor((rect_prop.factor_text_left[1] - rect_prop.factor_area_left[1]) * tmp_scale),
              width: Math.floor(rect_prop.factor_text_left[2] * tmp_scale),
              height: Math.floor(rect_prop.factor_text_left[3] * tmp_scale)
            }
          }

          // ちゃんと因子欄か丸ポチの有無で確認
          // 因子のまるポチのテンプレート読み込み
          let tmpl_factor_disc = cv.imread(document.getElementById('tmplFactorDisc'));
          cv.resize(tmpl_factor_disc, tmpl_factor_disc, new cv.Size(tmp_dic.rect_factor_disc.width, tmp_dic.rect_factor_disc.height), 0, 0, cv.INTER_CUBIC);

          // 丸ポチ部分でテンプレートマッチ
          // しきい値以上だったら因子名読み込み対象に追加
          let img_tgt = img_src.roi(new cv.Rect(Math.max(tmp_dic.rect_factor_disc.left - 1, 0), Math.max(tmp_dic.rect_factor_disc.top - 1, 0), tmp_dic.rect_factor_disc.width + 2, tmp_dic.rect_factor_disc.height + 2)).clone();
          if (match_tmpl_min_max_loc(img_tgt, tmpl_factor_disc).maxVal > thres_match_tmpl_disc) {
            // 塗りつぶし色を確認して赤青緑因子を除外
            let l_res_color = [];
            let img_1factor = img_src.roi(tmp_rect).clone();
            cv.cvtColor(img_1factor, img_1factor, cv.COLOR_RGB2HSV, 0);
            l_res_color.push({'color': 'red', 'val': calc_color_rate(img_1factor, [155, 100, 0, 0], [175, 205, 255, 0])});
            // l_res_color.push({'color': 'red', 'val': calc_color_rate(img_1factor, [0, 100, 0, 0], [15, 205, 255, 0])});
            l_res_color.push({'color': 'blue', 'val': calc_color_rate(img_1factor, [90, 150, 0, 0], [110, 255, 255, 0])});
            l_res_color.push({'color': 'green', 'val': calc_color_rate(img_1factor, [30, 150, 0, 0], [50, 255, 255, 0])});
            l_res_color.sort((first, second) => second['val'] - first['val']);
            // 三色どれもしきい値以下なら白因子扱い
            if (l_res_color[0]['val'] > thres_1factor_color) {
              tmp_dic['bg_color'] = l_res_color[0]['color'];
              tmp_dic['bg_color_val'] = l_res_color[0]['val'];
            } else {
              tmp_dic['bg_color'] = 'white';
              tmp_dic['bg_color_val'] = 1;
            }
            // console.log(tmp_rect, tmp_dic['bg_color'], tmp_dic['bg_color_val']);
            l_tmp.push(tmp_dic);
            img_1factor.delete();
          }
          tmpl_factor_disc.delete();
          img_tgt.delete();
        }
      }
    }
    // console.log(l_tmp);
    l_out.push(l_tmp);
    mv_contours.delete();
    mv_hierarchy.delete();
    img_src.delete();
    img_src_gamma.delete();
    tmpCanvasElement.remove();
  })
  msk_1factor.delete();
  return l_out;
}
function calc_color_rate(img_in, hsv_from, hsv_to) {
  let img_rgb = new cv.Mat();
  cv.inRange(
    img_in,
    new cv.Mat(img_in.rows, img_in.cols, img_in.type(), hsv_from),
    new cv.Mat(img_in.rows, img_in.cols, img_in.type(), hsv_to),
    img_rgb);

  let tmp_sum = 0;
  for (let i = 0; i < img_rgb.rows; i++) {
    for (let j = 0; j < img_rgb.cols; j++) {
      tmp_sum += img_rgb.ucharAt(i, j);
    }
  }
  let val_out = tmp_sum / (255 * img_rgb.rows * img_rgb.cols);
  img_rgb.delete();
  return val_out
}
function ocr_factor_text(eles_scroll_canvas, l_detected_factor) {
  return new Promise(async function(resolve){
    let l_scroll_canvas = Array.from(eles_scroll_canvas);
    const min_height_factor_text = 30;

    let l_skillnames = Object.keys(dict_skills);
    l_skillnames = l_skillnames.map(d => d.split('')).flat();
    char_whitelist = [...new Set(l_skillnames)].join('') + '◯〇';
    // console.log(char_whitelist);

    const worker = await Tesseract.createWorker({
      // corePath: '../../node_modules/tesseract.js-core',
      workerPath: "https://unpkg.com/tesseract.js@4.1.1/dist/worker.min.js",
      // logger: function(m){console.log(m);}
    });
    await worker.loadLanguage('jpn');
    await worker.initialize('jpn', 3);
    // await worker.setParameters({tessedit_char_whitelist: char_whitelist});
    for (let i = 0; i < l_detected_factor.length; i++) {
      for (let j = 0; j < l_detected_factor[i].length; j++) {
        let tmp_factor = l_detected_factor[i][j];
        if (tmp_factor.bg_color == 'white') {
          const tmpCanvasElement = document.createElement('canvas');
          // tmpCanvasElement.setAttribute('id', 'tmpCanvasElement' + i);
          const w = Math.max(tmp_factor.rect_factor_text.width, Math.floor(tmp_factor.rect_factor_text.width / tmp_factor.rect_factor_text.height * min_height_factor_text));
          const h = Math.max(tmp_factor.rect_factor_text.height, min_height_factor_text);
          tmpCanvasElement.width = w;
          tmpCanvasElement.height = h;
          tmpCanvasElement.getContext('2d').drawImage(
            l_scroll_canvas[i],
            tmp_factor.rect_factor_text.left,
            tmp_factor.rect_factor_text.top,
            tmp_factor.rect_factor_text.width,
            tmp_factor.rect_factor_text.height,
            0, 0, w, h);
          const data = await worker.recognize(tmpCanvasElement, {});
          // console.log(data);
          tmpCanvasElement.remove();
          // console.log(text);
          tmp_factor['factor_text'] = normalize_text(data.data.text, regexps);

          //アイコン描画
          let skill_icon_id = '';
          if (tmp_factor.factor_text in dict_skills) {
            skill_icon_id = 'skillIcon' + dict_skills[tmp_factor.factor_text].iconId;
          } else {
            skill_icon_id = 'skillIconUnknown';
          }
          // console.log(skill_icon_id);
          // console.log(tmp_factor.rect_factor_icon);
          l_scroll_canvas[i].getContext('2d').drawImage(
            document.getElementById(skill_icon_id),
            tmp_factor.rect_factor_icon.left,
            tmp_factor.rect_factor_icon.top,
            tmp_factor.rect_factor_icon.width,
            tmp_factor.rect_factor_icon.height,
          )
        }
      }
    }
    await worker.terminate();
    resolve(l_detected_factor);
  })
}
function normalize_text(text, regexps) {
  if (typeof text === 'undefined') {
    return ''
  } else {
    let t = text;
    t = hankaku2Zenkaku(t);
    regexps.forEach(r => {
      while (true) {
        let t_tmp = t.replace(r.pattern, r.rep);
        if (t == t_tmp) {
          break;
        } else {
          // console.log(t_tmp, t);
          t = t_tmp;
        }
      }
    })
    // console.log(text, t);
    return t
  }
}
function hankaku2Zenkaku(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}