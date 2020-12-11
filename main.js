const jokeBtn = document.querySelector('#joke-btn');
const jokeDiplay = document.querySelector('#joke-display');

jokeBtn.addEventListener('click', getJoke);

function getJoke(){
    fetch('https://official-joke-api.appspot.com/random_joke')
    // .then(response => response.json())
    // .then(json => console.log(json));
    .then(response => {
        if (!response.ok) {
            jokeDiplay.innerHTML = "Something went wrong. Try again later!";
        }else {
            return response.json();
        }
    })
    .then(json => jokeDiplay.innerHTML = `${json.setup} ${json.punchline}`);
}


