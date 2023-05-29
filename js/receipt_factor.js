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
  whole: [x_full, 51, width_full, 1910],
  scroll: [x_narrow, 947, width_narrow, 831],
  bottom_row: [x_narrow, 1695, width_narrow, 80],
  icon: [347, 235, 150, 150],
  eval_val: [357, 427, 133, 37],
  speed_val: [315, 556, 103, 37],
  growth_rate: [240, 848, 89, 34],
  register_partner: [541, 880, 454, 129],
};
rect_prop['header'] = [rect_prop['whole'][0], rect_prop['whole'][1], rect_prop['whole'][2], 100];
rect_prop['basic_info'] = [rect_prop['header'][0], rect_prop['header'][1] + rect_prop['header'][3], rect_prop['header'][2], 700];
const rect_prop_dynamic = {
  with_growth_rate: {
      basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], rect_prop.basic_info[3] + 133],
      scroll: [x_narrow, rect_prop.scroll[1] + 129, width_narrow, rect_prop.scroll[3] - 129],
  },
  with_register_partner: {
      basic_info: [rect_prop.header[0], rect_prop.header[1] + rect_prop.header[3], rect_prop.header[2], rect_prop.basic_info[3] + 205],
      scroll: [x_narrow, rect_prop.scroll[1] + 192, width_narrow, rect_prop.scroll[3] - 192],
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
const thres_gray = 240;
const thres_cont_close = 0.1;
const thres_match_tmpl = 0.92;
const thres_match_tmpl_basic_info = 0.85;
const thres_match_tmpl_higher = 0.55;
const thres_match_tmpl_rayout_type = 0.6;
const thres_header = 0.9;

//パラメータ
const force_one_group = false;
const load_parts = ['header', 'basic_info', 'tab', 'scroll_full_width', 'scroll', 'bottom_row', 'icon', 'eval_val', 'speed_val', 'stamina_val', 'power_val', 'guts_val', 'int_val'];
const tgt_parts_for_group = ['icon', 'eval_val', 'speed_val', 'stamina_val', 'power_val', 'guts_val', 'int_val'];

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

function detect_rects(img_in) {
  let img_gray = img_in.clone();
  cv.cvtColor(img_gray, img_gray, cv.COLOR_RGBA2GRAY, 0);
  let ksize = new cv.Size(5, 5);
  cv.GaussianBlur(img_gray, img_gray, ksize, 0, 0, cv.BORDER_DEFAULT);
  cv.threshold(img_gray, img_gray, thres_gray, 255, cv.THRESH_BINARY);
  let img_gray_half = img_gray.roi(new cv.Rect(0, Math.floor(img_in.rows / 2), img_in.cols, img_in.rows - Math.floor(img_in.rows / 2)));

  let mv_contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // 入力画像で輪郭抽出
  cv.findContours(img_gray_half, mv_contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, new cv.Point(0, Math.floor(img_in.rows / 2)));
  // 小さい輪郭は除外して再格納
  let mv_contours_only_large = new cv.MatVector();
  for (let i = 0; i < mv_contours.size(); i++) {
    if (cv.contourArea(mv_contours.get(i)) > (img_gray_half.cols ** 2) / 80) {
      mv_contours_only_large.push_back(mv_contours.get(i));
    }
  };
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
    if (!only_matched) {
      cont_out.push(mv_contours_only_large.get(i));
      info_out.push({
        'index': i,
        'is_close': is_close_val < thres_cont_close,
        'is_close_val': is_close_val
      });
    } else if (is_close_val < thres_cont_close && is_close_val < min_is_close_val) {
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
  };
  if (cont_out.length == 0) {
    throw new Error('閉じるボタンが正常に検出出来ない画像があります。');
  };
  let rect_close = cv.boundingRect(cont_out[0]);
  // 一度wholeの枠座標を計算
  let rect_whole = calc_rects(rect_close, {'whole': rect_prop.whole, 'close': rect_prop.close});
  // console.log(rect_close);
  // console.log(rect_whole);

  // ヘッダー部分がどのyから始まってるか調査
  let y_start = Math.max(0, Math.floor(rect_whole.whole.y - rect_whole.whole.height / 20));
  if (y_start + Math.floor(rect_whole.whole.height / 10) > img_in.rows) {
    throw new Error('閉じるボタンが正しく検出出来ない画像があります。');
  }
  let img_find_header = img_in.roi(new cv.Rect(0, y_start, img_in.cols, Math.floor(rect_whole.whole.height / 10))).clone();
  cv.cvtColor(img_find_header, img_find_header, cv.COLOR_RGB2HSV, 0);
  let green = new cv.Mat()
  // ヘッダー辺りで緑っぽいピクセルを抽出
  cv.inRange(
    img_find_header,
    new cv.Mat(img_find_header.rows, img_find_header.cols, img_find_header.type(), [20, 150, 0, 0]),
    new cv.Mat(img_find_header.rows, img_find_header.cols, img_find_header.type(), [80, 255, 255, 0]),
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
  let rayout_type = 'normal';
  let img_tgt = img_in.roi(new cv.Rect(rects_base.growth_rate.x - 2, rects_base.growth_rate.y - 2, rects_base.growth_rate.width + 4, rects_base.growth_rate.height + 4));
  let img_tmpl = cv.imread(document.getElementById('tmplGrowthRate'));
  cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
  let tmp_dst = new cv.Mat();
  cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.growth_rate.width, rects_base.growth_rate.height), 0, 0);
  if (match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal > thres_match_tmpl_rayout_type) {
    rayout_type = 'with_growth_rate';
  } else {
    img_tgt = img_in.roi(new cv.Rect(rects_base.register_partner.x - 2, rects_base.register_partner.y - 2, rects_base.register_partner.width + 4, rects_base.register_partner.height + 4));
    img_tmpl = cv.imread(document.getElementById('tmplRegisterPartner'));
    cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
    tmp_dst = new cv.Mat();
    cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.register_partner.width, rects_base.register_partner.height), 0, 0);
    if (match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal > thres_match_tmpl_rayout_type) {
      rayout_type = 'with_register_partner';
    } else {
      img_tmpl = cv.imread(document.getElementById('tmplUnregisterPartner'));
      cv.cvtColor(img_tmpl, img_tmpl, cv.COLOR_RGBA2RGB, 0);
      tmp_dst = new cv.Mat();
      cv.resize(img_tmpl, tmp_dst, new cv.Size(rects_base.register_partner.width, rects_base.register_partner.height), 0, 0);
      if (match_tmpl_min_max_loc(img_tgt, tmp_dst).maxVal > thres_match_tmpl_rayout_type) {
        rayout_type = 'with_register_partner';
      }
    }
  }
  img_tgt.delete();
  img_tmpl.delete();
  tmp_dst.delete();
  let rect_prop_added = add_rect_prop(rect_prop, rect_prop_dynamic, rayout_type);
  let rects = calc_rects(rect_close, rect_prop_added);
  console.log(rayout_type);
  console.log(rects);
  // console.log(rect_whole.whole);
  // console.log(rects.whole);
  if (!(
      0 <= rects.whole.x &&
      0 <= rects.whole.y &&
      rects.whole.x + rects.whole.width < img_in.cols &&
      rects.whole.y + rects.whole.height < img_in.rows)) {
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

  // メモリ解放
  img_gray.delete();
  img_gray_half.delete();
  mv_contours.delete();
  hierarchy.delete();
  mv_contours_only_large.delete();
  tmpl_gray.delete();
  mv_tmpl_contours.delete();
  tmpl_hierarchy.delete();
  img_find_header.delete();
  green.delete();
  cont_out.forEach(function(c){c.delete()});
  l_tmpl_contours_only_large.forEach(function(c){c.delete()});
  return rects;
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
function trim_parts(l_mat, l_rects) {
  return new Promise(function(resolve){
    console.log('閉じるボタンを基準に各パーツ切り出し');
    const n_tgt = l_mat.length;
    // パーツ毎の最小サイズを算出
    let tgt_sizes = {};
    load_parts.forEach(function(p){
      let tmp_w = Math.min(...l_rects.map((d) => {return d[p].width}));
      let tmp_h = Math.min(...l_rects.map((d) => {return d[p].height}));
      tgt_sizes[p] = {'width': tmp_w, 'height': tmp_h};
    });

    // 最小サイズに合わせて全パーツを切り出し
    let imgs = [];
    l_mat.forEach(function(m, i){
      let obj_tmp = {};
      load_parts.forEach(function(p){
        let tmp_mat = new cv.Mat();
        let tmp_dst = new cv.Mat();
        tmp_mat = m.roi(l_rects[i][p]).clone();
        cv.resize(tmp_mat, tmp_dst, tgt_sizes[p]);
        obj_tmp[p] = tmp_dst.clone();
        tmp_mat.delete();
        tmp_dst.delete();
      });
      imgs.push(obj_tmp);
    });
    resolve(imgs);
  })
}
function get_group_list(imgs) {
  return new Promise(function(resolve){
    console.log('入力画像をグループ分け');
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
      // 似てないと1、似てると0なので1.0で初期化
      let arr_val = new Array(n_tgt);
      for(let y = 0; y < n_tgt; y++) {
        arr_val[y] = new Array(n_tgt).fill(1.0);
      }
      // アイコン等からグループ決め
      // 全組み合わせでテンプレートマッチ
      imgs.forEach(function(img_tmpl, i){
        imgs.forEach(function(img_tgt, j){
          // 同じ組み合わせで二回チェックしないようjの方が大きいときだけチェック
          if (i < j) {
            tgt_parts_for_group.forEach(function(p){
              let res = match_tmpl_min_max_loc(img_tgt[p], img_tmpl[p].roi(new cv.Rect(0, 0, img_tmpl[p].cols - 1, img_tmpl[p].rows - 1)).clone());
              // パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
              arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal
            });
          }
        })
      })
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
function match_one_line(imgs, l_group, arr_val, arr_loc, i) {
  return new Promise(function(resolve){
    let img_tmpl = imgs[i];
    imgs.forEach(function(img_tgt, j){
      // 同じ画像ではなく、かつ同じグループだったら比較開始
      if (i != j && l_group[i] == l_group[j]) {
        let res = match_tmpl_min_max_loc(img_tgt.scroll, img_tmpl.bottom_row);
        // 1行分の範囲でヒットしたら重なってるはずのエリアで改めてヒットするか確認
        if (arr_val[Math.min(i, j)][Math.max(i, j)] < res.maxVal && thres_match_tmpl < res.maxVal) {
          // console.log(i, j);
          let dist = img_tgt.scroll.rows - img_tmpl.bottom_row.rows - res.maxLoc.y;
          let tmp_img_tgt = new cv.Mat();
          let tmp_img_tmpl = new cv.Mat();
          if (i >= j) {
            dist *= -1;
          }
          if (dist < 0) {
            tmp_img_tgt = img_tmpl.scroll.roi(new cv.Rect(0, -dist, img_tmpl.scroll.cols, img_tmpl.scroll.rows + dist)).clone();
            tmp_img_tmpl = img_tgt.scroll.roi(new cv.Rect(0, 0, img_tgt.scroll.cols, img_tgt.scroll.rows + dist)).clone();
          } else {
            tmp_img_tgt = img_tmpl.scroll.roi(new cv.Rect(0, dist, img_tmpl.scroll.cols, img_tmpl.scroll.rows - dist)).clone();
            tmp_img_tmpl = img_tgt.scroll.roi(new cv.Rect(0, 0, img_tgt.scroll.cols, img_tgt.scroll.rows - dist)).clone();
          }
          let tmp_res = match_tmpl_min_max_loc(tmp_img_tgt, tmp_img_tmpl);
          // console.log(i, j, res.maxVal, tmp_res.maxVal, dist);
          if (thres_match_tmpl_higher < tmp_res.maxVal) {
            arr_val[Math.min(i, j)][Math.max(i, j)] = res.maxVal;
            arr_loc[Math.min(i, j)][Math.max(i, j)] = dist;
          }
          tmp_img_tmpl.delete();
          tmp_img_tgt.delete();
        }
      }
    })
    resolve();
  })
}
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
    l_relative_height[0] = 0;
    let l_relative_height_score = new Array(n_tgt).fill(0.0);
    let l_isfinished = new Array(n_tgt).fill(false);
    let n_finished_before = -1;
    let n_finished = 0;
    // グループ毎に処理
    [...Array(Math.max(...l_group) + 1).keys()].forEach(function(current_group){
      let is_group_initialized = false;
      while (true) {
        n_finished_before = n_finished;
        [...Array(n_tgt).keys()].forEach(function(y){
          // 今のグループだけ処理
          if (l_group[y] == current_group) {
            // 各グループ先頭の画像を基準とする
            if (!is_group_initialized) {
              l_relative_height[y] = 0;
              l_relative_height_score[y] = 1;
              is_group_initialized = true;
            }
            // 相対座標が決まってたら、まだ決まってない他の画像に波及開始
            if (!l_isfinished[y] && l_relative_height[y] != null) {
              [...Array(n_tgt).keys()].forEach(function(i){
                [...Array(n_tgt).keys()].forEach(function(j){
                  if (arr_loc[i][j] != 0 && l_group[i] == current_group && l_group[j] == current_group) {
                    let tmp_relative_height_score = Math.min(l_relative_height_score[y], arr_val[i][j]);
                    if (i < y && j == y && l_relative_height_score[i] < tmp_relative_height_score) {
                      l_relative_height[i] = l_relative_height[y] - arr_loc[i][j];
                      l_relative_height_score[i] = tmp_relative_height_score;
                      l_isfinished[i] = false;
                    } else if (i == y && j > y && l_relative_height_score[j] < tmp_relative_height_score) {
                      l_relative_height[j] = l_relative_height[y] + arr_loc[i][j];
                      l_relative_height_score[j] = tmp_relative_height_score;
                      l_isfinished[j] = false;
                    }
                  }
                })
              })
              l_isfinished[y] = true
            }
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
      for (let i = 0; i < l_relative_height.length; i++) {
        if(l_group[i] == current_group) {
          l_relative_height[i] -= min_relative_height;
        }
      }
    })
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