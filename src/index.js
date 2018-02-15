import './index.scss';

export function init(id){
  console.log(`selector: ${id}`);
  const element = document.getElementById(id);

  element.innerHTML = 'Inset contents go here. Maybe a chart, maybe something else!';
  element.style.background = 'lightgray';
  element.style.height = '200px';
}
