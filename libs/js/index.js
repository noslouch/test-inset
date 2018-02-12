(function() {
  var $select = document.querySelector('.inset-select');
  var $inset  = document.querySelector('.media-object');
  $select.addEventListener('change', changeLayout);

  if (!window.location.hash) {
    history.pushState('', '', window.location.pathname);
    window.location.href = window.location.href + '#inline';
  } else {
    $select.value = window.location.hash.substr(1);

    // run changeLayout()
    var event = new Event('change');
    $select.dispatchEvent(event);
  }

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
}());
