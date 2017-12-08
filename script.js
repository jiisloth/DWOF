/**
 * Created by J on 29.12.2016.
 */


var weighttotal = 0;
var items = [];
var posX;
var posY;
var tracking = 0;
var start;
var startangl;
var mouseX;
var mouseY;
var buffer;
var clackclack = 0;
var clacksoundloop = 0;
var clacksound = [];
var pointerangle = 0;
var i;
var angl;

var dragging = true;
var clickking = false;
var spaceing = false;


var legitrotation = 360;


function getSettings() {
    weighttotal = 0;
    items = [];
    var itemcount = $('#itemsbody').children().length;
    if (itemcount < 1){
        items = [["Nothing", "1", "default"]];
        weighttotal = 1;
    } else {
        for (i = 0; i < itemcount; i++) {
            var current = $('#itemsbody').children().eq(i).find("input");
            var itemname = current.eq(0).val();
            var itemweight = current.eq(1).val();
            var itemimage = current.eq(2).val();
            if (itemweight > 0){
                if (itemimage == ""){
                    itemimage = "default"
                }
                items.push([itemname, itemweight, itemimage]);
                weighttotal += parseFloat(itemweight);
            }
        }
    }
    var tooBig = true;
    while (tooBig == true){
        tooBig = false;
        for (i = 0; i < items.length; i++) {
            if (items[i][1] > weighttotal/4){
                console.log("Sector was too big, divided into smaller sectors");
                tooBig = true;
                items[i][1] = items[i][1]/2;
                var spot = Math.floor(items.length/2) + 1 + i;
                if (spot > items.length){
                    spot = spot - items.length
                }
                items.splice(spot, 0, items[i].slice());
                break;
            }
        }
    }
    doSectors(items);
}

function getSectorDiv(totalangle, angle, color, content, image) {
    sector = "<div class='sectorholder' " +
    "style='-ms-transform: rotate(" + totalangle + "deg); /* IE 9 */" +
    " -webkit-transform: rotate(" + totalangle + "deg); /* Safari */" +
    " transform: rotate(" + totalangle + "deg);'>" +
    "<div class='sectoroffset'>" +
    "<div class='sector' " +
    "style='-ms-transform: rotate("+ (angle -90) + "deg); /* IE 9 */" +
    " -webkit-transform: rotate("+ (angle -90) + "deg); /* Safari */"+
    " transform: rotate("+ (angle -90) + "deg);" +
    " background: "+ color + "; background-size: cover; background-position: right'>" +
        "<div class='sectortextholder' "+
    "style='-ms-transform: rotate("+ (angle / 2 + (90 - angle)) +"deg); /* IE 9 */" +
    " -webkit-transform: rotate("+ (angle / 2 + (90 - angle)) +"deg); /* Safari */"+
    " transform: rotate("+ (angle / 2 + (90 - angle)) +"deg);'>" +
    "<div class='sectortext'>" +
    content +
    "</div>" +
    "</div>";
    if (image != ""){
        sector += "<img class='sectorimage' src='"+ image +"'>";
    }
    sector += "</div>" +
    "</div>" +
    "</div>";
    return sector;
}

function doSectors(items) {
    $("#wheel").empty();
    var totalangle = 0;
    for (i = 0; i < items.length; i++) {
        var color = "red";
        if (i%2 == 0){
            color = "white";
        }
        if (items.length%2 == 1 && i == 0){
            color = "limeGreen"
        }
        var sectorangle = 360*(parseFloat(items[i][1])/weighttotal);


        var image = "";
        if (items[i][2].indexOf(".") != -1){
            image = items[i][2];
        } else if (items[i][2] != "default" ){
            color =  items[i][2];
        }


        $(getSectorDiv(totalangle, sectorangle, color, items[i][0], image)).appendTo($("#wheel"));



        items[i].push(totalangle);
        totalangle += sectorangle;
        items[i].push(totalangle);
    }

}
function setStartCoordinates() {
    var wheelarea = $("#wheel");
    tracking = 1;
    posX = mouseX - (wheelarea.offset().left + wheelarea.width()/2);
    posY = mouseY - (wheelarea.offset().top + wheelarea.height()/2);
    startangl = Math.atan2(posX, posY) * (180/Math.PI);

    buffer = [startangl, start, startangl, start, startangl, start];

    start = new Date().getTime();
}


function trackMouse() {
    var wheelarea = $("#wheel");
    angl = Math.atan2(mouseX - (wheelarea.offset().left + wheelarea.width()/2), mouseY - (wheelarea.offset().top + wheelarea.height()/2)) * (180/Math.PI);
    document.getElementById("wheel").style.transform = "rotate("+ (rotationnow+(startangl - angl))+"deg)";

    buffer.push(angl);
    buffer.push(new Date().getTime());
    buffer.shift();
    buffer.shift();

    var xmouselength = mouseX - (wheelarea.offset().left + wheelarea.width()/2);
    var ymouselength = mouseY - (wheelarea.offset().top + wheelarea.height()/2);

    if (Math.sqrt(xmouselength * xmouselength + ymouselength * ymouselength) > 300){
        endTracking();
    }
}

function endTracking() {
    var wheelarea = $("#wheel");
    rotationnow = rotationnow+(startangl - angl);

    tracking = 2;
    var time = new Date().getTime() -start;
    posX = mouseX - (wheelarea.offset().left + wheelarea.width()/2);
    posY = mouseY - (wheelarea.offset().top + wheelarea.height()/2);
    var endangl = Math.atan2(posX, posY) * (180/Math.PI);
    var distance = endangl -startangl;
    if (distance > 180){
        distance = 180 - distance;
    } else if (distance < -180){
        distance = 360 + distance;
    }
    rotationspeed = (distance)*12/time;
    $("#legit").text("");
    $("#value").text("");
    $("#rotation").text("");
    clackclack = 0;
    rotateWheel();

}

function playclacksound() {
    clacksound[clacksoundloop].play();
    clacksoundloop += 1;
    if (clacksoundloop == clacksound.length-1){
        clacksoundloop = 0
    }
}



function rotateWheel() {
    rotationnow -= rotationspeed;
    clackclack += Math.abs(rotationspeed)*5;
    if (Math.abs(pointerangle) <= 3) {
        if (clackclack > 8) {
            pointerangle = rotationspeed * 4;
            playclacksound();
            rotationspeed -= (Math.abs(rotationspeed)/rotationspeed * Math.log(Math.abs(rotationspeed)+1))/3;
        }
    } else {
        pointerangle -= (Math.abs(pointerangle)/pointerangle * Math.log2(Math.abs(pointerangle)+1))/2;
    }
    if (clackclack > 8) {
            clackclack -= 8;
    }
    rotationspeed -= Math.abs(rotationspeed)/rotationspeed * 0.005;


    document.getElementById("pointer").style.transform = "rotate("+ pointerangle +"deg)";


    document.getElementById("wheel").style.transform = "rotate("+ rotationnow+"deg)";



    if (Math.abs(rotationspeed) <= 0.1 || isNaN(rotationspeed)){
        rotationspeed = 0;
        tracking = 0;
        if (Math.abs(rotationnow) - Math.abs(angl) <= legitrotation){
            $("#value").text("Too slow!");
            while( Math.abs(rotationnow) > 180) {
                rotationnow -= Math.abs(rotationnow) / rotationnow * 360;
            }
            return 0;
        }
        $("#value").text("");
        while( Math.abs(rotationnow) > 180) {
            rotationnow -= Math.abs(rotationnow) / rotationnow * 360;
        }
        getValueAt(360 -(rotationnow+90));
        return 0;
    }
    if (Math.abs(rotationnow) - Math.abs(angl) > legitrotation){
        $("#value").text("Legit");
    }
    setTimeout(rotateWheel, 20)

}



function addItem(name, weight, image) {

    $('<tr>' +
        '<td>' +
            '<input type="text" name="item" class="itemBox" value="' + name + '">' +
        '</td>' +
        '<td>' +
            '<input type="number" name="weight" class="weightBox" value="' + weight + '">' +
        '</td>' +
        '<td>' +
            '<input type="text" name="image" class="imageBox" value="' + image + '">' +
        '</td>' +
        '<td>' +
            '<img src="images/delete.png" class="delete">' +
        '</td>' +
    '</tr>').appendTo($('#itemsbody'));
}


function getValueAt(rotation) {
    for (i = 0; i < items.length; i++) {
        if (rotation > 360){
            rotation -= 360;
        }
        if (rotation >= items[i][3] && rotation  < items[i][4]){
            $("#value").text(items[i][0]);
        }
        $("#rotation").text(rotation);
    }

}


function getCookies(){
    items = Cookies.getJSON('items');

    if (typeof items != 'undefined'){
        // cookies found! yay!
        for (i = 0; i < items.length; i++){
            addItem(items[i][0],items[i][1],items[i][2])
        }

    } else {
        alert("You spin, you drink!\nNot for stupid people\nUses cookies. nom.");
        addItem("Nothing", "1", "default");
        items = []
    }
}



var rotationspeed = 0;
var rotationnow = 0;


var sound;

$( document ).ready(function() {

    getCookies();

    $("#rollbutton").hide();


    var wheelarea = $("#wheel");


    sound = document.getElementById("clack");

    //var ready = createClacksoundLoop();
    clacksound = [document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack"), document.getElementById("clack") ];

    getSettings();


    wheelarea.mousedown(function() {
        if (tracking == 0 && dragging){
            setStartCoordinates();
        }
    });
    wheelarea.mouseup(function() {
        if (tracking == 1){
            var angl = Math.atan2(mouseX - (wheelarea.offset().left + wheelarea.width()/2), mouseY - (wheelarea.offset().top + wheelarea.height()/2)) * (180/Math.PI);
            endTracking(angl);
        }

    });

    $("#add").click(function() {
        addItem("Nothing", "1", "default");
    });

    $("#settingsbtn").click(function() {
        $("#settings").show()
    });
    $("#exitsettings").click(function() {
        $("#settings").hide()
    });

    $("#save").click(function() {
        document.getElementById("letsroll").play();
        getSettings();
        dragging = ($("#checkdrag").is(":checked"));
        clickking = ($("#checkclick").is(":checked"));
        if ($("#checkclick").is(":checked")){
            $("#rollbutton").show();
        } else {
            $("#rollbutton").hide();
        }

        spaceing = ($("#checkspace").is(":checked"));
        $("#settings").hide()

        Cookies.set('items', items, { expires: 400 });
    });

    $("#itemsbody").delegate('.delete', 'click', function() {
        $(this).parents().get(1).remove();
    });

    $("#rollbutton").click(function() {
        if (tracking == 0 && clickking){
            tracking = 2;
            rotationspeed = ((Math.random())*12+20)/3;
            $("#legit").text("");
            $("#value").text("");
            $("#rotation").text("");
            clackclack = 0;
            angl = rotationnow;
            rotateWheel();
        }

    });
    $('body').keyup(function(e){
        if(e.keyCode == 32){
            if (tracking == 0 && spaceing){
                tracking = 2;
                rotationspeed = ((Math.random())*12+20)/3;
                $("#legit").text("");
                $("#value").text("");
                $("#rotation").text("");
                clackclack = 0;
                angl = rotationnow;
                rotateWheel();
            }
        }
    });

    $( document ).mousemove(function( e ) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        if (tracking == 1){
            trackMouse()
        }
    });

});