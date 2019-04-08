import { slug } from '../inset/data.json';
import './index.scss';

(() => {
  const element = document.getElementById(`${slug}-container`);

  element.innerHTML = 'Inset contents go here. Maybe a chart, maybe something else!';
  element.style.background = 'lightgray';
  element.style.height = '250px';
})();