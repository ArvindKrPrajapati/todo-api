const searchMovie = async (e) => {
  const url = "https://mytodo-api.cyclic.app/v1/mverse";
  const loader = document.querySelector("#loader");
  try {
    const s = e.target.value;
    if (s.length > 2) {
      loader.style.display = "block";
      const res = await fetch(url + "/search?name=" + s);
      const data = await res.json();
      loader.style.display = "none";
      let h = "";
      if (data.success) {
        if (data.data.length) {
          data.data.map((item) => {
            h += `<a href="/play/index.html?id=${item.tmdb_id}" class="d-flex mb-2 content">
      <img src="${item.poster_path}" class="img"/>
      <div class="p-3">
      <h3 style="color:gainsboro">${item.title}</h3>
      <small style="color:silver" class="text">${item.release_date}</small>
      <small style="color:grey" class="text">${item.overview}</small>
      </div>
      </a>`;
          });
          document.querySelector("#main").innerHTML = h;
        } else {
          document.querySelector("#main").innerHTML=`<div>
                <h4 style="color:silver">Not found</div>
              </div>`
          console.log("nothing found");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
