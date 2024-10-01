let isGoingGame = false;
const button = document.querySelector('.action-button');

window.addEventListener('orientationchange', setScreen);
window.addEventListener("DOMContentLoaded", setScreen);

function setScreen() {

    if (!isGoingGame) {
        document.querySelector('.instruction').style.display = 'none';
        
        document.querySelector('.body-container').style.display = 'none';
        unmuteAudio();
        return;
    } else {
        document.querySelector('.first-screen').style.display = 'none';
        document.querySelector('body').style.overflow = 'auto';
        muteAudio();
    }
    
    if ((window.orientation === 0 || window.orientation === 180) && window.innerWidth < 1000) {
        document.querySelector('.instruction').style.display = 'flex';
        document.querySelector('body').style.overflow = 'hidden';
        document.querySelector('.body-container').style.display = 'flex';
        muteAudio();
    } else if (window.orientation === 90 || window.orientation === -90) {
        document.querySelector('.body-container').style.display = 'flex';
        document.querySelector('.instruction').style.display = 'none';
        document.querySelector('body').style.overflow = 'auto';
       
        unmuteAudio();
    }
}

function getDeviceType() {
    if (window.matchMedia("(max-width: 767px)").matches) {
        return "Mobile";
    } else if (window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches) {
        return "Tablet";
    } else {
        return "Desktop";
    }
}

let gameInstance;
const sound = document.getElementById('sound');
let soundPlayed = false;

button.addEventListener('click', function() {
    startGame()
    if (!soundPlayed) {
        sound.play();
        soundPlayed = true;
    }
    SendYandexMetrica('clicked_button_play', '{}');
    isGoingGame = true;
    if (getDeviceType() === 'Desktop') {
        document.querySelector('.body-header').style.display = 'none';
        document.querySelector('.body-container').style.display = 'flex';
        document.querySelector('.first-screen').style.display = 'none';
        unmuteAudio();
    }
    else {
        setScreen();
    }

});



function muteAudio() {

        if (gameInstance) {
            gameInstance.SendMessage('SoundManager', 'MuteAudio');
         
        } 
 
}

function unmuteAudio() {
  
        if (gameInstance) {
            gameInstance.SendMessage('SoundManager', 'UnmuteAudio');
           
        }
    
  
}




function startGame() {
  
    window.addEventListener("load", function () {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("ServiceWorker.js");
        }
        });

        gameInstance;
        var container = document.querySelector("#unity-container");
        var canvas = document.querySelector("#unity-canvas");
        var loadingBar = document.querySelector("#unity-loading-bar");
        var progressBarFull = document.querySelector("#unity-progress-bar-full");
        var warningBanner = document.querySelector("#unity-warning");

        // Shows a temporary message banner/ribbon for a few seconds, or
        // a permanent error message on top of the canvas if type=='error'.
        // If type=='warning', a yellow highlight color is used.
        // Modify or remove this function to customize the visually presented
        // way that non-critical warnings and error messages are presented to the
        // user.
        function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
            if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
            setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
        }


        var buildUrl = "Build";
      var loaderUrl = buildUrl + "/SevBuild.loader.js";
      var config = {
        dataUrl: buildUrl + "/SevBuild.data.unityweb",
        frameworkUrl: buildUrl + "/SevBuild.framework.js.unityweb",
        codeUrl: buildUrl + "/SevBuild.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "Game Solutions",
        productName: "Splav",
        productVersion: "1.8.26",
        showBanner: unityShowBanner,
      };

        //By default Unity keeps WebGL canvas render target size matched with
        //the DOM size of the canvas element (scaled by window.devicePixelRatio)
        //Set this to false if you want to decouple this synchronization from
        //happening inside the engine, and you would instead like to size up
        //the canvas DOM size and WebGL render target sizes yourself.
        config.matchWebGLToCanvasSize = false;

        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);

        loadingBar.style.display = "block";

        var script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
        createUnityInstance(canvas, config, (progress) => {
          progressBarFull.style.width = 100 * progress + "%";
        }).then((unityInstance) => {
            gameInstance = unityInstance;
            loadingBar.style.display = "none";
            document.querySelector('.animation-item').style.display = 'none';
            document.querySelector('.loading').style.display = 'none';
            SendYandexMetrica('game_start', '{}');
        }).catch((message) => {
            alert(message);
        });
        };

        document.body.appendChild(script);
}

