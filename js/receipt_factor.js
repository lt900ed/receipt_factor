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
    console.log("DRAG & DROP");
    console.table(files);
    fileInput.files = files;
    photoPreview('onChange',files);
});
function photoPreview(event, fs = null) {
  var files = fs;
  if(files === null){
    files = event.target.files;
  }
  var preview = document.getElementsByClassName("container")[0];
  var previewImage = document.getElementsByClassName("previewImage");

  if(previewImage != null) {
    // preview.removeChild(previewImage);
  }
  for (i = 0; i < files.length; i++) {
    var reader = new FileReader();
    reader.onload = (function (e) {
      preview.innerHTML += '<div class="containerItem"><div class="functionWrap"><div class="icon--cross"></div></div><img class="previewImage" src="' + e.target.result + '"></div>';
    });
    reader.readAsDataURL(files[i]);
  };
}

