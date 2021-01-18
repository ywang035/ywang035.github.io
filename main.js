// function navbarChanger(){
//   let sections = document.querySelectorAll('section');
//   for (let i = 0; i < sections.length; i++){
//    console.log(sections[i]);
//   }
// }
// navbarChanger();



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


        // if (this.readyState == 4 && this.status == 200) {
        //     // Access the result here
        //     //  alert(this.responseText);

        //     var obj = JSON.parse(this.responseText);
        //     quote.innerHTML = "“ " + obj.contents.quotes[0].quote + " ”";
        //     author.innerHTML = "---- " + obj.contents.quotes[0].author;
        //     // document.body.style.display = 'block';
        // } else {
        //     //  alert("failed");
        // }

    };
    xhttp.open("GET", `${proxy}https://quotes.rest/qod?category=inspire`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}
get_quote_of_the_day()