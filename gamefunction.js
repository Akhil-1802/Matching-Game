
const imageArray = [
    'images/bulbasaur.jpeg',
    'images/charmendar.jpeg',
    'images/meowscarda.jpeg',
    'images/eevee.jpeg',
    'images/mudkip.jpeg',
    'images/pikachu.jpeg',
    'images/squirtle.jpeg',
    'images/vulpix.jpeg',
]

const gamebox = document.querySelector('.game-box')
const button = document.querySelector('.start')
const movesbutton = document.querySelector('.moves')
const resetbtn = document.querySelector('.resetbtn')
const newgamebtn = document.querySelector('.newgamebtn')
const highscore = document.querySelector('.highscore')
const highscore_2 = document.querySelector('.highscore_')

//Highscore updation
highscore.innerHTML = `High Score : ${localStorage.getItem('highscore') || 0}`

let resultbox=[]
let tempbox = []
let boxes = document.querySelectorAll('.box')
let movesCounter = 0
//Start button event
button.addEventListener('click',()=>{
    gamebox.style.display = 'grid'
    button.style.display = 'none'
    movesbutton.style.display = 'block'
    newgamebtn.style.display='none'
    resetbtn.style.display = 'block'
    highscore.style.display = 'none'
    highscore_2.style.display = 'block'
    highscore_2.innerHTML = `High Score : ${localStorage.getItem('highscore') || 0}`
    startgame()
})

function startgame(){
    InsertAtRandomPos() //Inserting images at random card
    displayImagesForInterval() //Displaying images for 2 sec
    setTimeout(() => { //Now hidding those images so that now user try to find the matching elements
        boxes.forEach(box=>{
            box.style.backgroundColor = 'rgba(255, 0, 0, 0.627)'
            box.firstElementChild.style.display ='none'
            box.removeAttribute("disabled");
        })
    }, 2000);
    gameLogic()
}

function displayImagesForInterval(){
    boxes.forEach(box=>{
        box.setAttribute("disabled", false);
        box.style.backgroundColor = 'transparent'
        box.firstElementChild.style.display ='block'
    })
}

function gameLogic(){
    boxes.forEach((box)=>{
        box.addEventListener('click', handleCardClick)
    })
}



function InsertAtRandomPos(){
    let elementInserted = [0,0,0,0,0,0,0,0]
    boxes.forEach((innerbox)=>{
        let randomPos = Math.floor(Math.random() * 8);
        while( elementInserted[randomPos] >= 2 ){
            randomPos = Math.floor(Math.random() * 8);
        }
        innerbox.innerHTML = `<img src=${imageArray[randomPos]}  alt="pokemon image">`
        elementInserted[randomPos]++;
    })
}

function endgame(){
    if(resultbox.length === 16){
        if(window.localStorage.getItem('highscore')=== null){
            window.localStorage.setItem('highscore',movesCounter)
            high_score_updated = true
            alert(`Hurrah ! It's a high score, You solved it in ${movesCounter} moves!`)
            highscore_2.innerHTML = `High Score : ${movesCounter}`
        }
        else{
            const highscore = window.localStorage.getItem('highscore')
            if(highscore > movesCounter){
                window.localStorage.removeItem('highscore')
                alert(`Hurrah ! It's a high score, You solved it in ${movesCounter} moves!`)
                window.localStorage.setItem('highscore',movesCounter)
                highscore_2.innerHTML = `High Score : ${movesCounter}`
            }
            else if(highscore === movesCounter){
                alert(`Excellent! You matched high score, by solving in ${movesCounter} moves!`)
            }
            else{
                alert(`You solved it in ${movesCounter} moves !`)
            }
        }
        resetbtn.style.display = 'none'
        newgamebtn.style.display = 'block'
        newgame()
    }
}
//In this function , we insert the box class and image in the tempbox array  then check whether the next box image matches with the previous one in tempbox if yes then we push both the images in resultbox array and remove them fromt tempbox array .
//After that those which are present in the resultbox array are visible to the user only .THis is the logic that i used in this matcher game
function handleCardClick(event){
    const box = event.target;
    box.style.backgroundColor = 'transparent'
    box.setAttribute("disabled", false);
    box.firstElementChild.style.display ='block'
    const classes = box.classList
    const image = box.getElementsByTagName('img')[0].src.split('Matching-Game')[1]
    setTimeout(() => {
        if(tempbox.length === 0 )
            tempbox.push({box:classes[1],image})
        else{
            found = false
            tempbox.forEach(temp=>{
                if(temp.image === image){
                    found = true
                }
            })
            if(found === false){
                tempbox.push({box:classes[1],image})
                tempbox.forEach(result =>{
                    const box = document.getElementsByClassName(result.box)
                    box[0].removeAttribute("disabled");
                    box[0].style.backgroundColor = 'rgba(255, 0, 0, 0.627)'
                    box[0].getElementsByTagName('img')[0].style.display = 'none'
                })
            }
            else{
                tempbox.push({box:classes[1],image})
                resultbox.push(tempbox[0])
                resultbox.push(tempbox[1])
            }
            tempbox = []
            movesCounter++
            movesbutton.innerHTML = `Moves : ${movesCounter}`
        }
        resultbox.forEach(result =>{
            const box = document.getElementsByClassName(result.box)
            box[0].setAttribute("disabled", false);
            box[0].style.backgroundColor = 'transparent'
            box[0].getElementsByTagName('img')[0].style.display = 'block'
        })
        console.log(tempbox)
        console.log(resultbox)
        endgame()
    }, 100);
}
function reset(){
    movesCounter = 0
        movesbutton.innerHTML = `Moves : 0`
        newgamebtn.style.display = 'none'
        boxes.forEach(box => {
            box.removeEventListener('click', handleCardClick)
            box.removeAttribute("disabled");
            box.innerHTML = ''
        })
        resultbox = []
        tempbox=[]
        resetbtn.style.display = 'block'
        startgame()
}

function newgame() {
    newgamebtn.addEventListener('click',()=>{
        reset()
    })
}

resetbtn.addEventListener('click',reset)