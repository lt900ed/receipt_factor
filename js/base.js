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
function outputMatVectorList2Canvas(l_mv, canvas_element) {
  let w = l_mv.reduce((sum, element) => sum + element.get(0).cols, 0);
  let h = Math.max(...l_mv.map((d) => [...Array(d.size()).keys()].map((f) => d.get(f).rows).reduce((sum, element) => sum + element, 0)));
  canvas_element.width = w;
  canvas_element.height = h;
  let draw_x = 0;
  for (let x = 0; x < l_mv.length; x++) {
    let draw_y = 0;
    for (let y = 0; y < l_mv[x].size(); y++) {
      let tmpCanvasElement = document.createElement('canvas');
      tmpCanvasElement.setAttribute('id', 'canvasOutput' + x + y);
      cv.imshow(tmpCanvasElement, l_mv[x].get(y));
      canvas_element.getContext('2d').drawImage(tmpCanvasElement, draw_x, draw_y);
      tmpCanvasElement.remove();
      draw_y += l_mv[x].get(y).rows;
    }
    draw_x += l_mv[x].get(0).cols;
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
  // try {
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
    dst = await generateReceipt(l_mat);
    if (!(typeof dst === "undefined")) {
      // 画像出力
      let tmpCanvasElement = document.getElementById('canvasOutput');
      if (!tmpCanvasElement) {
        // キャンバスがなかったら生成
        tmpCanvasElement = document.createElement('canvas');
        tmpCanvasElement.setAttribute('id', 'canvasOutput');
        tmpCanvasElement.classList.add('hidden');
        document.getElementById('overview').appendChild(tmpCanvasElement);
      }
      outputMatVectorList2Canvas(dst, tmpCanvasElement);
      // cv.imshow('canvasOutput', dst);

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
      dst.forEach(function(m){m.delete();});
    }
  // } catch(e) {
  //   console.log(e);
  //   raiseErrMsg(e.message);
  //   document.getElementById('loading').classList.add('hidden');
  // }
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
  document.getElementById('outputImage').addEventListener('click', toggleOutputImageSize, false);
};
