(function() {
  var $select = document.querySelector('.inset-select');
  var $inset  = document.querySelector('.media-object');
  $select.addEventListener('change', changeLayout);

  function changeLayout(e) {
    e.preventDefault();

    $inset.classList.remove('inline', 'wrap', 'margin', 'offset', 'bleed');
    $inset.classList.add(this.value);
  }
}());
