function raiseErrMsg(t) {
  let text = 'エラーが発生しました。ページを再読み込みして下さい。';
  if (!(typeof t === 'undefined')) {
    text = t;
  };
  document.getElementById('errMsg').textContent = text;
  document.getElementById('errMsg').classList.remove('hidden');
  setTimeout(function(){document.getElementById('errMsg').classList.add('hidden');}, Math.max(text.length * 120, 5000));
};
function raiseNormalMsg(t) {
  let text = '';
  if (!(typeof t === 'undefined')) {
    text = t;
  };
  document.getElementById('normalMsg').textContent = text;
  document.getElementById('normalMsg').classList.remove('hidden');
  setTimeout(function(){document.getElementById('normalMsg').classList.add('hidden');}, Math.max(text.length * 120, 5000));
};
function changePercentage(val) {
  document.getElementById('percentage').innerText = Math.floor(val) + '%';
  if (val == 100) {
    document.getElementById('loading').classList.add('hidden');
  } else {
    document.getElementById('loading').classList.remove('hidden');
  }
}
const repaint = async () => {
  for (let i = 0; i < 2; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
  }
};
function resetCanvas() {
  const canvas = document.getElementById("canvasOutput");
  if (canvas.getContext) {
      const context = canvas.getContext("2d");
      context.font = '25px Roboto medium';
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.fillText('ここに結果が表示されます', 0, 0);
  }
};
function deletePhoto(e) {
  e.target.closest('.containerItem').remove();
  if (document.getElementsByClassName('containerItem').length == 0) {
    manageBtnStatus('addImgNotReady');
  }
};
function addPhoto(e) {
  var preview = document.getElementsByClassName('container')[0];
  // preview.innerHTML += '<div class="containerItem"><div class="functionWrap"><div class="icon--cross"></div></div><img class="previewImage" src="' + e.target.result + '"></div>';
  var divContainerItem = document.createElement('div');
  divContainerItem.setAttribute('class', 'containerItem');

  var divFunctionWrap = document.createElement('div');
  divFunctionWrap.setAttribute('class', 'functionWrap');
  divContainerItem.appendChild(divFunctionWrap);

  var divIconCross = document.createElement('div');
  divIconCross.setAttribute('class', 'icon--cross');
  divIconCross.addEventListener('click', deletePhoto, false);
  divFunctionWrap.appendChild(divIconCross);

  var img = document.createElement('img');
  img.setAttribute('class', 'previewImage');
  img.setAttribute('src', e.target.result);
  divContainerItem.appendChild(img);
  preview.appendChild(divContainerItem);
};
async function addPhotoFromClipBoard() {
  try {
      // ClipboardItem オブジェクトのリストを取得
    const items = await navigator.clipboard.read();

    // ClipboardItem オブジェクトを一つずつ調べる
    let l_image_index = [];
    for (let i = 0; i < items.length; i++) {
      // ClipboardItem オブジェクト
      const item = items[i];
      // データタイプが "image/png" のデータが存在するかをチェック
      if (item.types.includes('image/png')) {
        l_image_index.push(i);
      }
    }
    if (l_image_index.length == 0) {
      raiseErrMsg('クリップボードに画像がありません。');
      return;
    }
    changePercentage(0);
    manageBtnStatus('addImgNotReady');
    let cnt_onload = 0;
    for (let i = 0; i < l_image_index.length; i++) {
      const item = items[l_image_index[i]];
      // Blob オブジェクトを取得
      const blob = await item.getType('image/png');

      // Blob オブジェクトを Data URL として読み取る
      const reader = new FileReader();
      reader.onload = (function(e) {
        addPhoto(e);
        ++cnt_onload;
        if (cnt_onload == l_image_index.length){
          manageBtnStatus('removeImgNotReady');
          changePercentage(100);
        };
      });
      reader.readAsDataURL(blob);
    }
  } catch(e) {
    console.log(e);
    raiseErrMsg('クリップボードから画像を読み取れませんでした。ブラウザが非対応の可能性があります。');
  }
};
function toggleOutputImageSize(e) {
  let outputImage = document.getElementById('outputImage');
  if (outputImage.classList.contains('full-width-image')) {
    outputImage.classList.remove('full-width-image');
  } else {
    outputImage.classList.add('full-width-image');
  }
};
function drawMat2Canvas(mat, canvas_element, x, y, width=-1, height=-1) {
  let tmpCanvasElement = document.createElement('canvas');
  tmpCanvasElement.setAttribute('id', 'tmpCanvas');
  cv.imshow(tmpCanvasElement, mat);
  if (width == -1) {
    canvas_element.getContext('2d').drawImage(tmpCanvasElement, x, y);
  } else {
    canvas_element.getContext('2d').drawImage(tmpCanvasElement, x, y, width, height);
  }
  tmpCanvasElement.remove();
}
function outputPartsList2Canvas(imgs, l_group, l_relative_height, canvas_element, show_header) {
  const show_close = false;
  const n_group = Math.max(...l_group) + 1;
  let w_one_col = Math.min(...imgs.map((e) => e.header.cols));
  let l_h_header = new Array(n_group).fill(0);
  let l_max_rh = new Array(n_group).fill(0);
  let l_scale_per_group = new Array(n_group).fill(1);
  let h = 0;
  [...Array(n_group).keys()].forEach(function(current_group){
    let tmp_h = 0;
    let img_header = imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == 0)[0];
    // グループ毎の縮尺を取得
    l_scale_per_group[current_group] = w_one_col / img_header.header.cols;
    if (show_header) {
      // ヘッダー分の高さを加算
      tmp_h += img_header.header.rows + img_header.basic_info.rows + img_header.tab.rows;
      l_h_header[current_group] = tmp_h;
    }
    // 一番下の画像の相対座標を加算
    l_max_rh[current_group] = Math.max(...l_relative_height.filter((d, i) => l_group[i] == current_group));
    tmp_h += l_max_rh[current_group];
    // 一番下の画像の高さを加算
    tmp_h += imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == l_max_rh[current_group])[0].scroll_full_width.rows;
    if (show_close) {
      // 閉じるボタンの高さを加算
      console.log('未実装');
    }
    // 最も小さい画像のグループに合わせて縮小
    tmp_h *= l_scale_per_group[current_group];
    h = Math.max(h, tmp_h);
  })
  if (!show_header) {
    // ヘッダー非表示なら幅はスクロール部分のみ基準に
    w_one_col = Math.min(...imgs.map((e) => e.scroll.cols));
  }
  let w = n_group * w_one_col;
  // console.log(w, h);
  // console.log(l_scale_per_group);
  canvas_element.width = w;
  canvas_element.height = h;
  canvas_element.getContext('2d').fillStyle = 'rgb(242, 242, 242)';
  canvas_element.getContext('2d').fillRect(0, 0, canvas_element.width, canvas_element.height);
  // 相対座標が大きい順のインデックスを取得
  // 下から貼り付けて切れ目が出るのを防ぐ
  let l_index_by_rh_desc = [...Array(imgs.length).keys()].sort((first, second) => l_relative_height[second] - l_relative_height[first]);
  l_index_by_rh_desc.forEach(function(i) {
    let current_group = l_group[i];
    let img = imgs[i];
    if (show_header && l_relative_height[i] == 0) {
      // ヘッダーを描画
      // console.log(i, current_group, current_group * w_one_col, 0, w_one_col, img.header.rows * l_scale_per_group[current_group]);
      drawMat2Canvas(img.header, canvas_element, current_group * w_one_col, 0, w_one_col, img.header.rows * l_scale_per_group[current_group]);
      drawMat2Canvas(img.basic_info, canvas_element, current_group * w_one_col, img.header.rows * l_scale_per_group[current_group], w_one_col, img.basic_info.rows * l_scale_per_group[current_group]);
      drawMat2Canvas(img.tab, canvas_element, current_group * w_one_col, (img.header.rows + img.basic_info.rows) * l_scale_per_group[current_group], w_one_col, img.tab.rows * l_scale_per_group[current_group]);
    }
    // スクロール部分を描画
    // console.log(i, current_group, current_group * w_one_col, (l_h_header[current_group] + l_relative_height[i]) * l_scale_per_group[current_group], img.scroll.cols * l_scale_per_group[current_group], img.scroll.rows * l_scale_per_group[current_group]);
    drawMat2Canvas(img.scroll, canvas_element, current_group * w_one_col, (l_h_header[current_group] + l_relative_height[i]) * l_scale_per_group[current_group], img.scroll.cols * l_scale_per_group[current_group], img.scroll.rows * l_scale_per_group[current_group]);
    if (show_close && l_relative_height[i] == l_max_rh[current_group]) {
      // 閉じるボタンを描画
      console.log('未実装');
    }
  })
};
// スクロール部分についてグループ毎に連結し別々のキャンバスに出力
function outputPartsList2Scroll2CanvasByGroup(imgs, l_group, l_relative_height, output_div, output_class_name) {
  const n_group = Math.max(...l_group) + 1;
  let w_one_col = Math.min(...imgs.map((e) => e.scroll.cols));
  let l_max_rh = new Array(n_group).fill(0);
  [...Array(n_group).keys()].forEach(function(current_group){
    let tmp_h = 0;
    let img_header = imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == 0)[0];
    // グループ毎の縮尺を算出
    let tmp_scale = w_one_col / img_header.scroll.cols;
    // キャンバスの高さ算出
    // 一番下の画像の相対座標を加算
    l_max_rh[current_group] = Math.max(...l_relative_height.filter((d, i) => l_group[i] == current_group));
    tmp_h += l_max_rh[current_group];
    // 一番下の画像の高さを加算
    tmp_h += imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == l_max_rh[current_group])[0].scroll.rows;
    // 最も小さい画像のグループに合わせて縮小
    tmp_h *= tmp_scale;
    // キャンバス生成
    let canvas_element = document.createElement('canvas');
    canvas_element.setAttribute('class', output_class_name);
    output_div.appendChild(canvas_element);
    // サイズ調整してそれっぽい色を背景色に設定
    canvas_element.width = w_one_col;
    canvas_element.height = tmp_h;
    canvas_element.getContext('2d').fillStyle = 'rgb(242, 242, 242)';
    canvas_element.getContext('2d').fillRect(0, 0, canvas_element.width, canvas_element.height);
    // 相対座標が大きい順のインデックスを取得
    // 下から貼り付けて切れ目が出るのを防ぐ
    let l_index_by_rh_desc = [...Array(imgs.length).keys()].filter((d, i) => l_group[i] == current_group).sort((first, second) => l_relative_height[second] - l_relative_height[first]);
    l_index_by_rh_desc.forEach(function(i) {
      let img = imgs[i];
      // スクロール部分を描画
      // console.log(i, current_group, w_one_col, (l_h_header[current_group] + l_relative_height[i]) * tmp_scale, img.scroll.cols * tmp_scale, img.scroll.rows * tmp_scale);
      drawMat2Canvas(img.scroll, canvas_element, 0, l_relative_height[i] * tmp_scale, img.scroll.cols * tmp_scale, img.scroll.rows * tmp_scale);
    })
  })
};
function outputScrollCanvas2OneCanvas(imgs, l_group, l_relative_height, eles_scroll_canvas, canvas_element, show_header) {
  const show_close = false;
  const n_group = Math.max(...l_group) + 1;
  let l_scroll_canvas = Array.from(eles_scroll_canvas);
  let w_one_col = Math.min(...imgs.map((e) => e.header.cols));
  let l_h_header = new Array(n_group).fill(0);
  let l_max_rh = new Array(n_group).fill(0);
  let l_scale_per_group = new Array(n_group).fill(1);
  let h = 0;
  [...Array(n_group).keys()].forEach(function(current_group){
    let tmp_h = 0;
    let img_header = imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == 0)[0];
    // グループ毎の縮尺を取得
    l_scale_per_group[current_group] = w_one_col / img_header.header.cols;
    if (show_header) {
      // ヘッダー分の高さを加算
      tmp_h += img_header.header.rows;
      if ('basic_info' in img_header) {
        tmp_h += img_header.basic_info.rows;
      }
      if ('tab' in img_header) {
        tmp_h += img_header.tab.rows;
      }
      l_h_header[current_group] = tmp_h;
    }
    // スクロール部の高さを加算
    tmp_h += l_scroll_canvas[current_group].height;
    if (show_close) {
      // 閉じるボタンの高さを加算
      console.log('未実装');
    }
    // 最も小さい画像のグループに合わせて縮小
    tmp_h *= l_scale_per_group[current_group];
    h = Math.max(h, tmp_h);
  })
  if (!show_header) {
    // ヘッダー非表示なら幅はスクロール部分のみ基準に
    w_one_col = l_scroll_canvas[0].width;
  }
  // console.log(w, h);
  // console.log(l_scale_per_group);
  // サイズ調整してそれっぽい色を背景色に設定
  let w = n_group * w_one_col;
  canvas_element.width = w;
  canvas_element.height = h;
  canvas_element.getContext('2d').fillStyle = 'rgb(242, 242, 242)';
  canvas_element.getContext('2d').fillRect(0, 0, canvas_element.width, canvas_element.height);

  if (show_header) {
    // ヘッダーを描画
    let l_index_header = [...Array(imgs.length).keys()].filter((d) => l_relative_height[d] == 0);
    l_index_header.forEach(function(i) {
      let current_group = l_group[i];
      let img = imgs[i];
      drawMat2Canvas(img.header, canvas_element, current_group * w_one_col, 0, w_one_col, img.header.rows * l_scale_per_group[current_group]);
      if ('basic_info' in img) {
        drawMat2Canvas(img.basic_info, canvas_element, current_group * w_one_col, img.header.rows * l_scale_per_group[current_group], w_one_col, img.basic_info.rows * l_scale_per_group[current_group]);
      }
      if ('tab' in img) {
        drawMat2Canvas(img.tab, canvas_element, current_group * w_one_col, (img.header.rows + img.basic_info.rows) * l_scale_per_group[current_group], w_one_col, img.tab.rows * l_scale_per_group[current_group]);
      }
    })
  }
  // スクロール部を描画
  [...Array(n_group).keys()].forEach(function(current_group){
    canvas_element.getContext('2d').drawImage(l_scroll_canvas[current_group], current_group * w_one_col, l_h_header[current_group] * l_scale_per_group[current_group]);
  })
  if (show_close) {
    // 閉じるボタンを描画
    console.log('未実装');
  }
};
function manageBtnStatus(action) {
  var btnSubmit = document.getElementById('btnSubmit');
  var btnReset = document.getElementById('btnReset');
  switch (action) {
    case 'addImgNotReady':
      btnSubmit.classList.add('imgNotReady');
      btnSubmit.classList.add('disable');
      btnReset.classList.add('imgNotReady');
      break;
    case 'removeImgNotReady':
      btnSubmit.classList.remove('imgNotReady');
      btnReset.classList.remove('imgNotReady');
      btnReset.classList.remove('disable');
      break;
    case 'removeCvNotReady':
      btnSubmit.classList.remove('cvNotReady');
      break;
  }
  if (!btnSubmit.classList.contains('imgNotReady') && !btnSubmit.classList.contains('cvNotReady')) {
    btnSubmit.classList.remove('disable');
  }
  if (btnReset.classList.contains('imgNotReady') && !document.getElementById('canvasOutput')) {
    btnReset.classList.add('disable');
  }
};
function photoPreview(event, fs = null) {
  let files = fs;
  if(files === null){
    files = event.target.files;
  }
  let cnt_onload = 0;
  for (i = 0; i < files.length; i++) {
    let reader = new FileReader();
    reader.onload = (function(e) {
      addPhoto(e);
      ++cnt_onload;
      if (cnt_onload == files.length){
        manageBtnStatus('removeImgNotReady');
      };
    });
    reader.readAsDataURL(files[i]);
  };
};
async function generatePhoto() {
  try {
    const is_show_skill_icon = document.getElementById('showSkillIcon').checked;
    // なんか長辺が2175pxより大きいとMatchShapesでエラーになるので予め小さくしとく
    const limit_px = 2175;
    if (document.getElementById('btnSubmit').classList.contains('imgNotReady')) {
      throw new Error('画像が読み込まれていません。');
    } else if (document.getElementById('btnSubmit').classList.contains('cvNotReady')) {
      throw new Error('ライブラリの読み込みが完了していません。');
    }
    // ローディング開始
    changePercentage(0);
    await repaint();
    // 入力画像群を隠し要素経由にして等倍で読み込み
    let imgElements = document.getElementsByClassName('previewImage');
    let l_mat = [];
    for (i = 0; i < imgElements.length; i++) {
      let tmpImgElement = document.createElement('img');
      tmpImgElement.setAttribute('src', imgElements[i].getAttribute('src'));
      let tmpImg = cv.imread(tmpImgElement);
      cv.cvtColor(tmpImg, tmpImg, cv.COLOR_RGBA2RGB, 0);
      // なんか長辺が2175pxより大きいとMatchShapesでエラーになるので予め小さくしとく
      if (tmpImg.rows > limit_px) {
        tmpImg = cv2_resize_fixed_aspect(tmpImg, -1, limit_px);
      } else if (tmpImg.cols > limit_px) {
        tmpImg = cv2_resize_fixed_aspect(tmpImg, limit_px, -1);
      }
      l_mat.push(tmpImg.clone());
      tmpImg.delete();
    };
    // メイン加工関数呼び出し
    let l_rects = await get_rects(l_mat);
    console.log(l_rects);
    if (is_show_skill_icon) {changePercentage(5)} else {changePercentage(10)};
    await repaint();
    let imgs = await trim_parts(l_mat, l_rects);
    if (is_show_skill_icon) {changePercentage(10)} else {changePercentage(20)};
    await repaint();
    let l_group = await get_group_list(imgs, l_rects);
    if (is_show_skill_icon) {changePercentage(15)} else {changePercentage(30)};
    await repaint();

    console.log('グループ内でテンプレートマッチ');
    const n_tgt = imgs.length;
    // 結果格納用配列初期化
    let arr_val = new Array(n_tgt);
    for (let y = 0; y < n_tgt; y++) {arr_val[y] = new Array(n_tgt).fill(0.0);}
    let arr_loc = new Array(n_tgt);
    for (let y = 0; y < n_tgt; y++) {arr_loc[y] = new Array(n_tgt).fill(0.0);}
    // グループ内でテンプレートマッチ
    for (let i = 0; i < n_tgt; i++) {
      console.log((i + 1) +  '/' + n_tgt);
      await match_one_line(imgs, l_group, arr_val, arr_loc, i);
      if (is_show_skill_icon) {changePercentage(15 + (25 / n_tgt) * i)} else {changePercentage(30 + (50 / n_tgt) * i)};
      await repaint();
    }
    // arr_val.forEach(function(r){console.log(r)});
    // arr_loc.forEach(function(r){console.log(r)});

    let l_relative_height = await get_relative_dist(arr_val, arr_loc, l_group);
    await align_missing_imgs(l_relative_height, l_group, imgs);
    if (is_show_skill_icon) {changePercentage(50)} else {changePercentage(90)};
    await repaint();
    console.log('画像出力');
    let tmpCanvasElement = document.getElementById('canvasOutput');
    if (!tmpCanvasElement) {
      // キャンバスがなかったら生成
      tmpCanvasElement = document.createElement('canvas');
      tmpCanvasElement.setAttribute('id', 'canvasOutput');
      tmpCanvasElement.classList.add('hidden');
      document.getElementById('overview').appendChild(tmpCanvasElement);
    }
    outputPartsList2Scroll2CanvasByGroup(imgs, l_group, l_relative_height, document.getElementById('tmpCanvasScrolls'), 'canvasScroll');
    if (document.getElementById('showSkillIcon').checked) {
      console.log('スキルアイコン追加');
      // 因子の表示位置取得
      let l_detected_factor = detectFactor(document.getElementsByClassName('canvasScroll'));
      changePercentage(75);
      await repaint();
      // 因子名のOCR処理
      l_detected_factor = await ocr_factor_text(document.getElementsByClassName('canvasScroll'), l_detected_factor);
      let ocr_result_text = l_detected_factor.map(d => d.filter(d => d.factor_text != '' && !(d.factor_text in dict_skills)).map((d) => d.factor_text).join());
      ocr_result_text = ocr_result_text.filter(d => d != '').join();
      if (!ocr_result_text == '') {
        document.getElementById('overviewOCRResult').classList.remove('hidden');
        document.getElementById('outputOCRResult').value = ocr_result_text;
      } else {
        document.getElementById('overviewOCRResult').classList.add('hidden');
      }
      changePercentage(90);
      await repaint();
    } else {
      document.getElementById('overviewOCRResult').classList.add('hidden');
    }
    outputScrollCanvas2OneCanvas(imgs, l_group, l_relative_height, document.getElementsByClassName('canvasScroll'), tmpCanvasElement, document.getElementById('showHeader').checked);

    //img要素に出力
    let outputImage = document.getElementById('outputImage');
    outputImage.src = tmpCanvasElement.toDataURL('image/png');
    outputImage.classList.remove('hidden');
    // ローディング解除
    changePercentage(100);
    // 保存ボタンを出してスクロール
    document.getElementById('SaveBtnArea').classList.remove('hidden');
    document.getElementById('outputAreaText').classList.add('hidden');
    document.getElementById('toggleSizeText').classList.remove('hidden');
    document.getElementById('overview').scrollIntoView({behavior : 'smooth', block : 'start'});
    // メモリ解放
    l_mat.forEach(function(m){m.delete();});
    // dst.forEach(function(m){m.delete();});
    imgs.forEach(function(i){
      load_parts.forEach(function(p){
        if (p in i) {
          i[p].delete();
        }
      })
    });
    // スクロール部Canvas削除
    const node = document.getElementById('tmpCanvasScrolls');
    while(document.getElementById('tmpCanvasScrolls').firstChild){
      node.removeChild(node.firstChild);
    }
  } catch(e) {
    console.log(e);
    raiseErrMsg(e.message);
    document.getElementById('loading').classList.add('hidden');
  }
};
function resetPhoto() {
  try {
    if (document.getElementById('btnReset').classList.contains('imgNotReady') && !document.getElementById('canvasOutput')) {
      throw new Error('画像が読み込まれていません。');
    }
    let preview = document.getElementsByClassName('container')[0];
    while(preview.firstChild){
      preview.removeChild(preview.firstChild);
    }
    if (document.getElementById('canvasOutput')) {
      document.getElementById('overview').removeChild(document.getElementById('canvasOutput'));
    }
    document.getElementById('SaveBtnArea').classList.add('hidden');
    document.querySelector('#overview > p').classList.remove('hidden');
    manageBtnStatus('addImgNotReady');
  } catch(e) {
    raiseErrMsg(e.message);
  }
};
function onOpenCvReady() {
  manageBtnStatus('removeCvNotReady');
};
function GeneratedDownloadAnker(base64, name){
  //アンカータグを生成しhrefへBase64文字列をセット
  const a = document.createElement('a');
  a.href = base64;

  //ダウンロード時のファイル名を指定
  a.download = name;

  //クリックイベントを発生させる
  a.click();
};
function SaveOriginal(canvas_src, ext){
  //出力用canvas生成
  const canvas_out = document.createElement('canvas');
  const ctx_out = canvas_out.getContext('2d');

  //入力canvasをそのまま出力用に書き込み
  canvas_out.width = canvas_src.width;
  canvas_out.height = canvas_src.height;
  ctx_out.drawImage(canvas_src, 0, 0, canvas_src.width, canvas_src.height, 0, 0, canvas_out.width, canvas_out.height);

  let date = new Date();
  let str_dt = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2) + date.getMilliseconds();

  //アンカータグ経由でダウンロード
  switch (ext) {
    case 'jpg':
      GeneratedDownloadAnker(canvas_out.toDataURL('image/jpeg', 0.95), 'receipt_' + str_dt + '.jpg');
      break;
    case 'png':
      GeneratedDownloadAnker(canvas_out.toDataURL('image/png'), 'receipt_' + str_dt + '.png');
      break;
    default:
      GeneratedDownloadAnker(canvas_out.toDataURL('image/jpeg', 0.95), 'receipt_' + str_dt + '.jpg');
  };
  if (!document.getElementById('overviewOCRResult').classList.contains('hidden')) {
    document.getElementById('overviewOCRResult').scrollIntoView({behavior : 'smooth', block : 'start'});
  }
};
function SaveToClipBoard(canvas_src) {
    // Canvas から Blob オブジェクトを生成
  canvas_src.toBlob(async (blob) => {
    try {
        // 画像データをクリップボードに書き込む
      const item = new ClipboardItem({
        'image/png': blob
      });
      await navigator.clipboard.write([item]);
      raiseNormalMsg('クリップボードにコピーしました。');
    } catch(e) {
      console.log(e);
      raiseErrMsg('クリップボードにコピー出来ませんでした。ブラウザが非対応の可能性があります。');
    }
  });
}
window.onload = function () {
  let fileArea = document.getElementById('dragDropArea');
  let fileInput = document.getElementById('fileInput');
  fileArea.addEventListener('dragover', function(e){
    e.preventDefault();
    fileArea.classList.add('dragover');
  });
  fileArea.addEventListener('dragleave', function(e){
      e.preventDefault();
      fileArea.classList.remove('dragover');
  });
  fileArea.addEventListener('drop', function(e){
      e.preventDefault();
      fileArea.classList.remove('dragenter');
      let files = e.dataTransfer.files;
      fileInput.files = files;
      photoPreview('onChange',files);
  });
  document.getElementById('btnUploadFromClipboard').addEventListener('click', addPhotoFromClipBoard, false);
  shortcut.add('Ctrl+V', addPhotoFromClipBoard, {});
  document.getElementById('outputImage').addEventListener('click', toggleOutputImageSize, false);
};
