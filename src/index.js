import CONFIG from '../inset/data.json';
import './index.scss';

(() => {
  const element = document.getElementById(`${CONFIG.slug}-container`);

  element.innerHTML = 'Inset contents go here. Maybe a chart, maybe something else!';
  element.style.background = 'lightgray';
  element.style.height = '200px';
})();