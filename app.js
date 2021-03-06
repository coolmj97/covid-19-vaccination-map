'use strict';

const pageDown = document.querySelector('.home__move');
const pageBack = document.querySelector('.fa-arrow-left');
const searchSection = document.querySelector('.search');

const siDo = document.querySelector('.search__sido');
const siGunGu = document.querySelector('.search__sigungu');
const searchBtn = document.querySelector('.search__button');
const table = document.querySelector('.search__result');
const mapSection = document.querySelector('.search__map');

const key = `&serviceKey=yDWrbznr2zPgQ1DYYzbvG2D%2FSMiFDz1uNQODPzTf3zTroIyeWJIB5r9bjVLBuXgl9v%2FwCc2I8lZZgsRit39yuQ%3D%3D`;
const url = `https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=257${key}`;

let map;

function reloadMap() {
  table.addEventListener('click', (e) => {
    if (e.target.className === 'result__map__link') {
      if (window.innerWidth <= 768) {
        const resultDetail = e.target.parentNode;
        const address = resultDetail.previousSibling;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${address.innerText}`;
        e.target.href = mapUrl;
        siDo.value = '';
        siGunGu.value = '';
      } else {
        const currentList = e.target.parentNode;
        const lat = currentList.firstElementChild;
        const lng = lat.nextElementSibling;

        if (e.target.id === currentList.id) {
          const userPosition = {
            lat: parseFloat(lat.innerText),
            lng: parseFloat(lng.innerText),
          };

          map = new google.maps.Map(mapSection, {
            center: userPosition,
            zoom: 15,
          });

          new google.maps.Marker({
            position: userPosition,
            map: map,
          });
        }
      }
    }
  });
}

function makeHTML(result) {
  const li = document.createElement('li');
  const resultAddress = document.createElement('span');
  const resultDetail = document.createElement('div');
  const resultMapLink = document.createElement('a');

  const latitude = document.createElement('span');
  const longitude = document.createElement('span');

  li.classList.add('result__center');
  resultAddress.classList.add('result__address');
  resultDetail.classList.add('result__detail');
  resultMapLink.classList.add('result__map__link');
  latitude.classList.add('coordinates');
  longitude.classList.add('coordinates');

  resultDetail.id = result.id;
  resultMapLink.id = result.id;

  li.innerText = result.centerName;
  resultAddress.innerText = result.address;
  resultMapLink.innerText = '?????? ??????';
  latitude.innerText = result.lat;
  longitude.innerText = result.lng;

  table.appendChild(li);
  li.appendChild(resultAddress);
  li.appendChild(resultDetail);
  resultDetail.appendChild(latitude);
  resultDetail.appendChild(longitude);
  resultDetail.appendChild(resultMapLink);
}

function onSearchBtn(result) {
  searchBtn.addEventListener('click', () => {
    siGunGu.disabled = false;
    table.innerHTML = '';
    try {
      for (let i = 0; i < result.length; i++) {
        makeHTML(result[i]);
      }
      table.style.display = 'block';
    } catch {
      alert('??????????????? ????????? ???????????? ????????? ??? ????????????.');
    }
  });
}

function filterRegion(arr) {
  siDo.addEventListener('input', (e) => {
    if (siDo.value === '') {
      alert('????????? ???????????????.');
      return;
    }
    const userSido = e.target.value;
    const sidoResult = arr.filter((item) => item.sido === userSido);

    if (userSido === '?????????????????????') {
      siGunGu.disabled = true;
      onSearchBtn(sidoResult);
    } else {
      siGunGu.disabled = false;
      siGunGu.addEventListener('input', (e) => {
        if (siGunGu.value === '') {
          alert('????????? ???????????????.');
          return;
        }
        const userSigungu = e.target.value;
        const result = sidoResult.filter(
          (item) => item.sigungu === userSigungu
        );
        onSearchBtn(result);
      });
    }
  });
}

function loadData() {
  return fetch(url)
    .then((response) => response.json())
    .then((json) => filterRegion(json.data));
}

function createOption(item) {
  siGunGu.innerHTML = `<option value="">???????????????</option>`;

  const array = Object.values(item);
  const length = array.length;

  for (let i = 0; i < length - 1; i++) {
    const option = document.createElement('option');
    option.innerText = array[i];
    option.value = array[i];
    siGunGu.appendChild(option);
  }
}

function setForm(data) {
  siDo.addEventListener('input', (e) => {
    if (e.target.value === '?????????????????????') {
      siGunGu.innerHTML = '';
      return;
    }

    for (let i = 0; i < siDo.length; i++) {
      if (e.target.value === data[i].city) {
        createOption(data[i]);
        break;
      }
    }
  });
}

function loadSigungu() {
  return fetch('./data.json')
    .then((response) => response.json())
    .then((json) => setForm(json.details));
}

function movePage() {
  pageDown.addEventListener('click', () => {
    searchSection.scrollIntoView({ behavior: 'smooth' });
  });

  pageBack.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function init() {
  movePage();
  loadSigungu();
  loadData();
  reloadMap();
}

init();
