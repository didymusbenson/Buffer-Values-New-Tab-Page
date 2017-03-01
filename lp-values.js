(function () {
    'use strict';

    var displayModes = ['pictures', 'colors'];

    var backgroundImages = [
    ['../graphics/backgrounds/1.jpg',
     '../graphics/backgrounds/2.jpg'],
          ['../graphics/backgrounds/3.jpg',
     '../graphics/backgrounds/4.jpg'],
          ['../graphics/backgrounds/5.jpg',
     '../graphics/backgrounds/6.jpg'],
          ['../graphics/backgrounds/7.jpg',
     '../graphics/backgrounds/8.jpg'],
          ['../graphics/backgrounds/9.jpg',
     '../graphics/backgrounds/10.jpg'],
          ['../graphics/backgrounds/11.jpg',
     '../graphics/backgrounds/12.jpg'],
          ['../graphics/backgrounds/13.jpg',
     '../graphics/backgrounds/14.jpg'],
          ['../graphics/backgrounds/15.jpg',
     '../graphics/backgrounds/16.jpg'],
          ['../graphics/backgrounds/17.jpg',
     '../graphics/backgrounds/18.jpg'],
          ['../graphics/backgrounds/19.jpg',
     '../graphics/backgrounds/20.jpg']
  ];

    //    const testFolder = '../graphics/backgrounds/';
    //const fs = require('fs');
    //fs.readdir(testFolder, (err, files) => {
    //  files.forEach(file => {
    //    backgroundImages.push(file);
    //  });
    //});
    //    console.log(backgroundImages);
    var itscattimeImages = [
    '../graphics/itscattime/cat-1.jpg',
    '../graphics/itscattime/cat-2.jpg'
  ];

    init();

    function init() {
        var values = document.querySelectorAll('.value');
        var isItCatTime = wouldItBeCatTime();
        var displayMode = isItCatTime ? displayModes[0] : (localStorage.getItem('mode') || displayModes[0]);
        var randValueIndex;
        var randValue;

        randValueIndex = getRandom(values.length);
        randValue = values[randValueIndex];

        document.body.classList.add('mode-' + displayMode);
        randValue.classList.add('is-visible'); // \o/



        if (isItCatTime) {
            displayPictures('itscattime', randValueIndex);
            document.body.classList.add('is-cattime');
        } else {
            displayMode == 'pictures' ? displayPictures('backgrounds', randValueIndex) : displayColors(randValueIndex);
        }

        initBindings();
    }

    function initBindings() {
        document.getElementById('mode-selector').addEventListener('click', function (e) {
            if (e.target.nodeName != 'BUTTON') return;

            var mode = e.target.getAttribute('data-select-mode');
            changeMode(mode);
        });
    }

    function displayPictures(pictureSetName, randValueIndex) {
        var randBackgroundIndex;
        var fadeImgIn;
        var img;

        var pictureSet = getPictureSet(pictureSetName);

        // Load image
        // We're using a hidden img element to load the image and be able to listen to its
        // load event, in order to prevent visual glitchs which would happen if made visible
        // before; once the load event fires, we smoothly reveal the background. We're not
        // revealing the img element itself because 'object-fit: cover' causes glitches too
        // when animated, so we use a pseudo-element's background with 'background-size: cover'
        // to display the image.
        img = document.createElement('img');
        randBackgroundIndex = getRandom(pictureSet.range); // 2 backgrounds each
        img.src = pictureSet.getSrc(randValueIndex, randBackgroundIndex);
        document.body.appendChild(img);

        // Once loaded, reveal it
        // A pseudo-element's styles can't be accessed programmatically, so inserting a new
        // style rule in the stylesheet to set the background dynamically it is! :)
        fadeImgIn = function () {
            document.styleSheets[1].insertRule(`
        body::before {
          background-image: url(${img.src});
        }
      `, 0);
            document.body.classList.add('background-is-loaded');
        };

        if (img.complete) fadeImgIn(); // Fade in if already loaded
        else img.addEventListener('load', fadeImgIn); // Or fade in when loaded
    }

    function displayColors(randValueIndex) {
        document.body.classList.add('color-' + (randValueIndex + 1));
    }

    // Return an integer between 0 and (range - 1)
    function getRandom(range) {
        return Math.floor(Math.random() * range);
    }

    function getPictureSet(pictureSetName) {
        var pictureSets = {
            backgrounds: {
                range: 2, // Each value has 2 backgrounds
                arr: backgroundImages,
                getSrc: function (randValueIndex, randBackgroundIndex) {
                    return this.arr[randValueIndex][randBackgroundIndex]
                }
            },
            itscattime: {
                range: itscattimeImages.length,
                arr: itscattimeImages,
                getSrc: function (randValueIndex, randBackgroundIndex) {
                    return this.arr[randBackgroundIndex]
                }
            }
        };

        return pictureSets[pictureSetName];
    }

    // Well, yes
    function wouldItBeCatTime() {
        return getRandom(500) == 0;
    }

    function changeMode(mode) {
        if (displayModes.indexOf(mode) == -1) return;

        localStorage.setItem('mode', mode);
        location.reload();
    }

})();
