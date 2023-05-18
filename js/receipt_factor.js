var fileArea = document.getElementById('dragDropArea');
var fileInput = document.getElementById('fileInput');
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
    var files = e.dataTransfer.files;
    console.log('DRAG & DROP');
    console.table(files);
    fileInput.files = files;
    photoPreview('onChange',files);
});
function deletePhoto(e) {
  console.log(e.target);
  e.target.closest('.containerItem').remove();
  if (document.getElementsByClassName('containerItem').length == 0) {
    document.getElementById('btnSubmit').classList.add('imgNotReady');
    document.getElementById('btnSubmit').classList.add('disable');
    document.getElementById('btnReset').classList.add('imgNotReady');
    document.getElementById('btnReset').classList.add('disable');
  }
}
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
      btnReset.classList.add('disable');
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
  if (document.getElementById('btnReset').classList.contains('imgNotReady')) {
    console.log('img is not ready.');
  } else if (document.getElementById('btnReset').classList.contains('cvNotReady')) {
    console.log('opencv is not ready.');
  } else {
    let imgElements = document.getElementsByClassName('previewImage');
    let mat = cv.imread(imgElements[0]);
    var dst = new cv.Mat();
    cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow('canvasOutput', dst);
    mat.delete();
    dst.delete();
  }
};
function resetPhoto() {
  if (document.getElementById('btnReset').classList.contains('imgNotReady')) {
    console.log('img is not ready.');
  } else {
    var preview = document.getElementsByClassName('container')[0];
    while(preview.firstChild){
      preview.removeChild(preview.firstChild);
    }
    manageBtnStatus('addImgNotReady');
  }
};
function onOpenCvReady() {
  manageBtnStatus('removeCvNotReady');
};