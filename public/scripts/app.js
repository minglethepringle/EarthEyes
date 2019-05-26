var latitude;
var longitude;
var new_latitude;
var new_longitude;
var hide = false;
$("body").ready(function () {
    // Mobilenet
    async function loadNet() {
        startLoading();
        net = await mobilenet.load();
        stopLoading();
    }

    async function guess() {

        var imgEl = document.getElementById('photo');
        var result = await net.classify(imgEl);
        if (result.length <= 0) {
            setResult("", "");
            stopLoading();
            return;
        }
        var guess = result[0]["className"];
        var probability = result[0]["probability"];
        if (probability <= 0.20) {
            setResult("", "");
            stopLoading();
            return;
        }

        navigator.geolocation.getCurrentPosition(function (pos) {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            console.log(latitude);
            console.log(longitude);
            var query = guess;
            query = encodeURIComponent(query);
            console.log(query);
            $.get("/endpoint/query/" + latitude + "/" + longitude + "/" + query, function (data) {
                new_latitude = data["latitude"];
                new_longitude = data["longitude"];
                console.log(new_latitude);
                console.log(new_longitude);
                //var hre = "https://www.google.com/maps/dir/?api=1&origin="+latitude+","+longitude+"&destination="+new_latitude+","+new_longitude;
                //        var hre="https://www.google.com/maps/dir/"+latitude+","+longitude+"/"+new_latitude+","+new_longitude+"/"+new_latitude+","+new_longitude+"18z";
                configureMapButton(document.getElementById("woahwoahwoah1"));

                setResult(guess, (!$.isEmptyObject(data)) ? data.description : "");
                stopLoading();
            }).fail(function () {
                alert("Server error!");
                stopLoading();
            });

        });

    }

    function configureMapButton(button) {
        if (new_latitude && new_longitude && latitude && longitude) {
            console.log("here1");
            var hre1 = "https://www.google.com/maps/dir/?api=1&origin=" + latitude + "," + longitude + "&destination=" + new_latitude + "," + new_longitude;
            button.onclick = function () {
                window.open(hre1, '_blank', 'resizable=yes')
            };
            button.style.display = "";
        } else {
            button.style.display = "none";
        }
    }

    /* Video Streaming */
    var video = $("#video")[0];
    var canvas = $("#canvas")[0];
    var photo = $("#photo")[0];
    var streaming = false;
    var width = 0,
        height = 0;
    navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            },
            audio: false
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            streaming = true;
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });
    video.addEventListener('canplay', function (ev) {
        width = video.videoWidth;
        height = video.videoHeight;
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        }
    }, false);

    function takePicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/jpeg');
            photo.setAttribute('src', data);
            photo.setAttribute('width', width);
            photo.setAttribute('height', height);
            setTimeout(guess, 2000);

            hideResultSection();
            // activate loading icon
            startLoading();
        } else {
            clearPhoto();
        }
    }


    function clearPhoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    $(".take-picture").click(function (e) {
        e.preventDefault();
        takePicture();
    });

    /* Loading icon */
    function startLoading() {
        $(".loading-icon").fadeIn(300);
    }

    function stopLoading() {
        $(".loading-icon").fadeOut(300);
    }

    /* Result section */
    function setResult(object, location) {
        if (object == "") {
            $(".result-object p").hide();
            $(".result-object-name").text("I'm not sure what this is.");
            $(".result hr").addClass("m-0");
            $('.result-location').hide();
        } else if (location == "") {
            $(".result-object-name").text(object);
            $(".result-location-name").text("N/A");
        } else {
            $(".result-object-name").text(object);
            $(".result-location-name").text(location);
        }

        showResultSection();
    }

    function hideResultSection() {
        $(".result").fadeOut(300);
        $(".result-object p").show();
        $('.result-location').show();
        $(".result hr").removeClass("m-0");
    }

    function showResultSection() {
        $(".result").fadeIn(300);
    }


    /* ============================================ */

    /* Quick Recycle */
    $(".quick-recycle button").click(function() {
        getDetails($(this).data("id"));
    });

    /* Search Bar */
    $(".form-control").click(function () {
        $(this).focus();
    });

    $(".search-form").submit(function (e) {
        e.preventDefault();
        var searchInput = $(".search-form input").val();
        if (searchInput.length > 0) {
            searchInput = encodeURIComponent(searchInput);
            startLoading();
            $.get("/endpoint/getMaterials/" + searchInput, function (data) {
                stopLoading();
                if(data.length == 0) {
                    alert("No results found!");
                    return;
                }
                $(".search-list").html("");
                $.each(data, function(i, obj) {
                    $(".search-list").append('<li data-id="' + obj.material_id + '">' + obj.description + '</li>');
                });
                $(".page-search-list").show();
            }).fail(function() {
                alert("Could not search!");
                stopLoading();
            });
        }
    });

    $(".search-list").on("click", "li", function() {
        getDetails($(this).data("id"));
    });

    /* Details Section */
    function getDetails(id) {
        startLoading();
        $.get("/endpoint/getDetails/" + id, function (data) {
            setDetails(data);
        }).fail(function () {
            alert("Server error!");
            stopLoading();
        });
    }

    function setDetails(data) {
        $(".page-search-list").hide();

        $(".material-name").text(data.description);
        $(".material-description").text(data.long_description);
        navigator.geolocation.getCurrentPosition(function (pos) {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            $.get("/endpoint/getLocationFromMaterialId/" + latitude + "/" + longitude + "/" + data.material_id, function (data) {
                new_latitude = data["latitude"];
                new_longitude = data["longitude"];
                //var hre = "https://www.google.com/maps/dir/?api=1&origin="+latitude+","+longitude+"&destination="+new_latitude+","+new_longitude;
                //        var hre="https://www.google.com/maps/dir/"+latitude+","+longitude+"/"+new_latitude+","+new_longitude+"/"+new_latitude+","+new_longitude+"18z";
                configureMapButton(document.getElementById("woahwoahwoah2"));

                var name = data.description;
                $(".nearest-location-name").text((name != null) ? name : "N/A");

                stopLoading();
            }).fail(function () {
                alert("Server error!");
                stopLoading();
            });

            $(".page-details").show();
        });
    }

    $("body").on("click", ".back-button", function() {
        $(this).parent().parent().fadeOut();
    });

    loadNet();
});