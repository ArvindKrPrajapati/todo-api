const params = new URLSearchParams(window.location.href.split("?")[1]);
const url = "https://mytodo-api.cyclic.app/v1/mverse";
const main = document.querySelector("#main");
const loader = document.querySelector("#loader");

// Get individual query parameters
const id = params.get("id");
if (!id) {
  alert("not found");
} else {
  fetch(url + "/details/" + id)
  .then((res) => res.json())
  .then((data) => {
    main.style.display = "block";
    loader.style.display = "none";
    if (data.success) {
      if (data.data.length) {
        const details = data.data[0];
        let sources = data.data.map((item) => {
          return {
            file: item.video[0].href,
            label: item.video[0].resolution + "p - " + item.video[0].language,
            type: "video/mp4",
          };
        });
        const h = `<section class="content">
        <div class="layout">
        <div id="player"></div>
        <div class="p-4">
        <h2 class="text-white mb-0">${details.title}</h2>
        <small style="color:gainsboro; display:block" class="mb-1">Release Date : ${details.release_date}</small><br>
        <small style="color:#eee">${details.overview}</small>
        </div>
        </div>
        </div>
        `;

        document.querySelector("#main").innerHTML = h;
        var player = jwplayer("player");
        player.setup({
         /// file: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sources: sources,
          stretching: "uniform",
        });
        player.addButton(
          "./aspect-ratio.svg",
          "Toggle Resize",
          function() {
            // Click handler function
            if (player.getStretching() === "uniform") {
              player.setConfig({
                stretching: "exactfit"
              })

            } else if (player.getStretching() === "exactfit") {
              player.setConfig({
                stretching: "fill"
              });
            } else {
              player.setConfig({
                stretching: "uniform"
              });
            }
          },
          "myButtonId"
        );
        player.addButton(
          "./fast-forward-10.svg",
          "skip 10s",
          function() {
            // Click handler function
            player.seek(player.getPosition()+10)
          },
          "myButtonId2"
        );
      } else {
        console.log("movie not found");
      }
    } else {
      console.log("error");
    }
  })
  .catch((e) => {
    console.log(e);
  });
}