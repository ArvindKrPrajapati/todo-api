
const url = "https://mytodo-api.cyclic.app/v1/mverse";

const main = document.querySelector("#main");
const loader = document.querySelector("#loader");

fetch(url + "/all?limit=5")
  .then((res) => res.json())
  .then((data) => {
    main.style.display = "block";
    loader.style.display = "none";
    let h = "";
    let s = "";
    data.data.map((item, index) => {
      h += `<div class="carousel-item ${index == 0 && "active"}">
    <div class="overlay">
    <div>
    <img  src="${item.poster_path}" class="d-block o-img" alt="...">
    <b>${item.title}</b>
    <a href="/play/index.html?id=${
      item.tmdb_id
    }"  class="btn btn-danger">Watch Now</a>
    </div>
    </div>
    <img  src="${item.backdrop_path}" class="d-block w-100 c-img" alt="...">
    </div>`;
      s += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to=${index} ${
        index == 0 && 'class="active" aria-current="true"'
      } aria-label="Slide ${index + 1}"></button>`;
    });
    document.querySelector(".carousel-inner").innerHTML = h;
    document.querySelector(".carousel-indicators").innerHTML = s;

    //console.log(h)
  })
  .catch((e) => {
    console.log(e);
  });

fetch(url + "/all?limit=9&country=India")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      let i = "";
      data.data.map((item) => {
        i += `<a href="/play/index.html?id=${item.tmdb_id}" class="my-card">
      <img src="${item.poster_path}" class="my-card-img"/>
      </a>`;
      });
      document.querySelector(".indian").innerHTML = i;
    }
  })
  .catch((e) => {
    console.log(e);
  });
//foreign
fetch(url + "/all?limit=9&country=foreign")
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      let i = "";
      data.data.map((item) => {
        i += `<a href="/play/index.html?id=${item.tmdb_id}" class="my-card">
      <img src="${item.poster_path}" class="my-card-img"/>
      </a>`;
      });
      document.querySelector(".foreign").innerHTML = i;
    }
  })
  .catch((e) => {
    console.log(e);
  });
