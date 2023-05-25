const video = document.querySelector("video");
const loader = document.querySelector(".custom-spinner");
const overlay = document.querySelector(".overlay");
const playBtn = document.querySelector(".playBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const backBtn = document.querySelector(".backBtn");
const forwardBtn = document.querySelector(".forwardBtn");
const loader_container = document.querySelector(".loader-container");
const timeDisplay = document.querySelector("#time-display");
const slider = document.querySelector(".range");
const fullscreen = document.querySelector("#fullscreen");
const controls = document.querySelector(".controls");
const footer = document.querySelector(".footer");
const video_container = document.querySelector(".video-container");
const aspect_ratio = document.querySelector("#aspect-ratio");
const settingbtn = document.querySelector("#setting");
const options = document.querySelector("#options");

video.addEventListener("error", function (event) {
  alert(event.target.error);
});

video.addEventListener("loadedmetadata", function () {
  var currentTime = formatTime(video.currentTime);
  setTime(currentTime);
  setSlider(video.currentTime);
});

video.addEventListener("timeupdate", function () {
  var currentTime = formatTime(video.currentTime);
  setTime(currentTime);
  setSlider(video.currentTime);
});

function setTime(currentTime) {
  const duration = formatTime(video.duration);
  if (duration) {
    timeDisplay.textContent = currentTime + " / " + duration;
  }
}
function setSlider(currentTime) {
  const duration = video.duration;
  if (duration) {
    slider.value = (currentTime / duration) * 100;
  }
}
function formatTime(time) {
  var hours = Math.floor(time / 3600);
  var minutes = Math.floor((time % 3600) / 60);
  var seconds = Math.floor(time % 60);
  var formattedTime = "";

  if (hours > 0) {
    formattedTime += (hours < 10 ? "0" + hours : hours) + ":";
  }

  formattedTime +=
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);

  return formattedTime;
}

pauseBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  video.pause();
  togglePlayPauseBtn();
});

settingbtn.addEventListener("click", (event) => {
  event.stopPropagation();
  options.style.transform = "translateY(0)";
});

options.addEventListener("click", (event) => {
  options.style.transform = "translateY(100%)";
});

playBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  video.play();
  togglePlayPauseBtn();
});
fullscreen.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!document.fullscreenElement) {
    controls.style.marginTop = "15px";
    footer.style.padding = "0px 8px 15px 8px";
    if (video_container.requestFullscreen) {
      video_container.requestFullscreen();
    } else if (video_container.mozRequestFullScreen) {
      // Firefox
      video_container.mozRequestFullScreen();
    } else if (video_container.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      video_container.webkitRequestFullscreen();
    } else if (video_container.msRequestFullscreen) {
      // IE/Edge
      video_container.msRequestFullscreen();
    }
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape");
    }
  } else {
    controls.style.marginTop = "0px";
    footer.style.padding = "0px";
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }
});

backBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const toskip = video.currentTime - 10;
  video.currentTime = toskip;
  setTime(formatTime(toskip));
  setSlider(toskip);
});
aspect_ratio.addEventListener("click", (event) => {
  event.stopPropagation();
  const ar = video.style.objectFit;
  console.log("pehe", ar);
  if (!ar) {
    video.style.objectFit = "fill";
  } else if (ar == "fill") {
    video.style.objectFit = "cover";
  } else {
    video.style.objectFit = "";
  }
  console.log(video.style.objectFit);
});

forwardBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const toskip = video.currentTime + 10;
  video.currentTime = toskip;
  setTime(formatTime(toskip));
  setSlider(toskip);
});

slider.addEventListener("change", function (event) {
  event.stopPropagation();
  var duration = video.duration;
  var currentTime = (slider.value / 100) * duration;
  video.currentTime = currentTime;
  setTime(formatTime(currentTime));
});

function togglePlayPauseBtn() {
  if (video.paused) {
    pauseBtn.style.display = "none";
    playBtn.style.display = "flex";
  } else {
    pauseBtn.style.display = "flex";
    playBtn.style.display = "none";
  }
}

overlay.addEventListener("click", () => {
  overlay.style.visibility = "hidden";
});

loader_container.addEventListener("click", () => {
  overlay.style.visibility = "visible";
});

video.addEventListener("canplay", function () {
  togglePlayPauseBtn();
  loader_container.style.background = "transparent";
  loader.style.display = "none";
});
video.onwaiting = function () {
  loader.style.display = "block";
};

function changeLink(item,event) {
  const s = item.video[0].href;
  const mx_link = document.querySelector("#mx-link");
 mx_link.href=`intent:${s}#Intent;package=com.mxtech.videoplayer.ad;end`
  loader_container.style.background = "black";
  const link_btn = document.getElementsByClassName("video-link");
  for (let i = 0; i < link_btn.length; i++) {
    link_btn[i].style.background = "#0d0d5c";
  }
  event.target.style.background = "red";
  const ct = video.currentTime;
  const videoSource = document.querySelector("#video-source");
  videoSource.src = s;
  setTime(ct);
  setSlider(ct);
  video.load();
  video.currentTime = ct;
  video.play();
}
document.getElementById("defaultOpen").click();
function openTab(evt, tabName) {
  evt.stopPropagation();

  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
document.getElementById("defaultSpeed").style.color = "red";
document.getElementById("videoSelected").style.background = "red";

function changeSpeed(rate, event) {
  document.querySelector("#speed-btn-group div").style.color = "#eee";
  const link_btn = document.getElementsByClassName("speed-link");
  for (let i = 0; i < link_btn.length; i++) {
    link_btn[i].style.color = "gainsboro";
  }
  event.target.style.color = "red";
  video.playbackRate = rate;
}
