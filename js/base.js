function raiseErrMsg(t) {
  document.getElementById('errMsg').textContent = t;
  document.getElementById('errMsg').classList.remove('hidden');
  setTimeout(function(){document.getElementById('errMsg').classList.add('hidden');}, Math.max(t.length * 120, 5000));
};
function raiseNormalMsg(t) {
  document.getElementById('normalMsg').textContent = t;
  document.getElementById('normalMsg').classList.remove('hidden');
  setTimeout(function(){document.getElementById('normalMsg').classList.add('hidden');}, Math.max(t.length * 120, 5000));
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
  console.log(e.target);
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
  var files = fs;
  if(files === null){
    files = event.target.files;
  }
  var cnt_onload = 0;
  for (i = 0; i < files.length; i++) {
    var reader = new FileReader();
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
function generatePhoto() {
  if (document.getElementById('btnSubmit').classList.contains('imgNotReady')) {
    raiseErrMsg('画像が読み込まれていません。');
    return;
  } else if (document.getElementById('btnSubmit').classList.contains('cvNotReady')) {
    raiseErrMsg('加工ライブラリの読み込みが完了していません。');
    return;
  }

  if (!document.getElementById('canvasOutput')) {
    // キャンバスがなかったら生成
    let tmpCanvasElement = document.createElement('canvas');
    tmpCanvasElement.setAttribute('id', 'canvasOutput');
    document.getElementById('overview').appendChild(tmpCanvasElement);
  }
  // 入力画像群を隠し要素経由にして等倍で読み込み
  let imgElements = document.getElementsByClassName('previewImage');
  var l_mat = [];
  for (i = 0; i < imgElements.length; i++) {
    var tmpImgElement = document.createElement('img');
    tmpImgElement.setAttribute('src', imgElements[i].getAttribute('src'));
    l_mat.push(cv.imread(tmpImgElement));
  };
  // メイン加工関数呼び出し
  dst = generateReceipt(l_mat);
  cv.imshow('canvasOutput', dst);
  document.getElementById('SaveBtnArea').classList.remove('hidden');
  document.querySelector('#overview > p').classList.add('hidden');

  document.getElementById('overview').scrollIntoView({behavior : 'smooth', block : 'start'});
};
function resetPhoto() {
  if (document.getElementById('btnReset').classList.contains('imgNotReady') && !document.getElementById('canvasOutput')) {
    raiseErrMsg('画像が読み込まれていません。');
    return;
  }
  var preview = document.getElementsByClassName('container')[0];
  while(preview.firstChild){
    preview.removeChild(preview.firstChild);
  }
  document.getElementById('overview').removeChild(document.getElementById('canvasOutput'));
  document.getElementById('SaveBtnArea').classList.add('hidden');
  document.querySelector('#overview > p').classList.remove('hidden');
  manageBtnStatus('addImgNotReady');
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

  var date = new Date();
  var str_dt = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2) + ('0' + date.getSeconds()).slice(-2) + date.getMilliseconds();

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
};
