





var url="https://mytodo-api.cyclic.app/v1/mverse"
const params = new URLSearchParams(window.location.href.split("?")[1]);
const type = params.get("type"); 
const country = params.get("country"); 
const page = Number(params.get("page")) || 1; 
const main = document.querySelector("#main");
const loader = document.querySelector("#loader");
const htmlTitle = document.querySelector("#title");
const paginationHtml = document.querySelector("#pagination");
 url=url+"/all?skip="+(page-1)*20
if(country){
  url=url+"&country="+country
}
if(type){
  url=url+"&type="+type
}
htmlTitle.innerHTML=`${country || "Discover"} ${type || "More"}`


fetch(url)
  .then((res) => res.json())
  .then((data) => {
    loader.style.display="none"
    paginationHtml.style.display="block"
    main.style.display="flex"
    if (data.success) {
      let i = "";
      data.data.map((item) => {
        i += `<a href="/play/index.html?id=${item.tmdb_id}" class="my-card">
      <img src="${item.poster_path}" class="my-card-img"/>
      </a>`;
      });
      main.innerHTML = i;
      document.querySelector("#pagination").innerHTML=`<div class="mt-5" style="margin:auto">
  <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-end">
    <li class="page-item"><a class="page-link" style="display:${page<=1 ? 'none' : 'block'}" href="#">${page-1}</a></li>
    <li class="page-item active"><a class="page-link" href="#">${page}</a></li>
    <li class="page-item"><a class="page-link" href="#">${page+1}</a></li>
  </ul>
</nav>
      </div>`
      
    }
  })
  .catch((e) => {
    console.log(e);
  });