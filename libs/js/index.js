(function() {
  var $select = document.querySelector('.inset-select');
  var $inset  = document.querySelector('.media-object');
  $select.addEventListener('change', changeLayout);

  function changeLayout(e) {
    e.preventDefault();

    $inset.classList.remove('inline', 'wrap', 'margin', 'offset', 'bleed');
    $inset.classList.add(this.value);

    modifyUrl();
  }

  function modifyUrl(){
    history.pushState('', '', window.location.pathname);
    window.location.href = window.location.href + '#' + $select.value;
  }

  $select.value = window.location.hash.substr(1);
  var event = new Event('change');
  $select.dispatchEvent(event);

  modifyUrl();
}());
