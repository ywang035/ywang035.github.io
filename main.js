// change nav item style when scrolling through sections
const navs = document.querySelectorAll('li');
var navArr = Array.from(navs);

var screenHeight = window.innerHeight;
window.addEventListener("resize", function(){
    screenHeight = window.innerHeight
});

document.addEventListener('scroll', function(e){
    // console.log(document.documentElement.scrollTop);
    let topPosition = document.documentElement.scrollTop;
    let bottomPosition = topPosition + screenHeight;
    if(topPosition >= screenHeight && topPosition < screenHeight*2){
        navArr[0].classList.add('nav-active');
        navArr[1].classList.remove('nav-active');
    }else if(topPosition >= screenHeight*2){
        navArr[0].classList.remove('nav-active');
        navArr[1].classList.add('nav-active');
    }else{
        navArr[0].classList.remove('nav-active');
        navArr[1].classList.remove('nav-active');
    }
});



// get daily quote from API
const quote = document.querySelector('#quote');
const author = document.querySelector('#author');

function get_quote_of_the_day() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4){
            if(this.status == 200){
                var obj = JSON.parse(this.responseText);
                quote.innerHTML = "“ " + obj.contents.quotes[0].quote + " ”";
                author.innerHTML = "---- " + obj.contents.quotes[0].author;
                document.body.style.display = 'block';
            }else{
                quote.innerHTML = " Whoever is happy will make others happy too. ";
                author.innerHTML = "---- " + " Anne Frank";
                document.body.style.display = 'block';
            }
        }
    };
    xhttp.open("GET", `${proxy}https://quotes.rest/qod?category=inspire`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}
get_quote_of_the_day()