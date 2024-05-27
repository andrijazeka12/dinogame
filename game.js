// postavljanje platna
kaboom({
  width: 1050,
  height: 400,
  font: "sinko",
  canvas: document.querySelector("#mycanvas")
})

// učitavanje sličica
loadSprite("t-rex", "sprites/t-rex.png")
loadSprite("background", "sprites/background.png")
loadSprite("cactus", "sprites/cactus.png")

// učitavanje zvukova
loadSound("jump", "sounds/jump.mp3")
loadSound("hit", "sounds/hit.mp3")

FLOOR_HEIGHT = 10 // na kojoj visini (odozdo) će se nalaziti Dino i kaktusi
JUMP_FORCE = 800 // jačina kojom će Dino skakati (veće - viši skok)
SPEED = 480 // brzina kojom će se kaktusi kretati ulevo (veće - brže kretanje)

// scena sa igrom
scene("game", () => {
  // podešavamo gravitaciju
  // 0 - bestežinsko stanje
  gravity(2400)

  // pri dnu platna dodajemo pod
  add([
    rect(width(), FLOOR_HEIGHT),
    pos(0, height() - FLOOR_HEIGHT),
    area(),
    solid() // solid i area su neophodni ukoliko želimo da drugi karakteri ne prolaze kroz naš pod
  ])

  // dodajemo pozadinu
  add([
    sprite("background", {
      width: width(),
      height: height()
    })
  ])

  // dodajemo dinosaurusa (Dino) u okviru platna na poziciji (80, 40)
  // kako smo definisali gravitaciju i kako Dino poseduje "body" komponentu
  // on će pasti usled gravitacije prema dnu platna
  trex = add([
    sprite("t-rex"),
    pos(80, 40),
    area(),
    body()
  ])

  // definišemo šta se događa klikom na "space" taster
  onKeyPress("space", jump)

  function jump() {
    // Dino će skočiti samo ukoliko je na podu (isGrounded)
    // ovime izbegavamo višestruke skokove
    if (trex.isGrounded()) {
      play("jump")
      trex.jump(JUMP_FORCE)
    }
  }

  // kreni sa generisanjem kaktusa pozivom funkcije
  spawnCactus()

  function spawnCactus() {
    // dodajemo kaktus na kraj desne strane platna
    add([
      sprite("cactus"),
      area(),
      pos(width(), height() - FLOOR_HEIGHT),
      origin("botleft"),
      move(LEFT, SPEED), // dodati kaktus se kreće ulevo definisanom brzinom
      "tree" // koristićemo tag "tree" da detektujemo da li je došlo do sudara sa kaktusima
    ])

    // sačekaj određeno nasumično vreme (0.5 - 1.5s) pre nego što generišeš ponovo kaktus
    wait(rand(0.5, 1.5), spawnCactus)
  }

  // ukoliko je Dino udario u neki karakter koji poseduje tag "tree"
  trex.onCollide("tree", () => {
    // pređi na scenu za kraj igre
    go("lose", score)
    // pusti definisan zvuk "hit"
    play("hit")
  })

  // promenljiva za praćenje rezultata
  score = 0

  // postavljamo tekst u okviru platna sa trenutnim rezultatom
  scoreLabel = add([
    text(score, { size: 40 }),
    pos(24, 24)
  ])

  // povećaj rezultat prilikom svakog frejma
  onUpdate(() => {
    score++
    scoreLabel.text = score
  })
})

// scena za kraj igre
scene("lose", (score) => {
  // postavi crnu pozadinu
  add([
    rect(width(), height()),
    color(0, 0, 0)
  ])

  // prikaži ostvareni rezultat
  add([
    text("Rezultat: " + score, { size: 60 }),
    pos(10, 10)
  ])

  // klikom na space taster započinjemo ponovo igru
  onKeyPress("space", () => go("game"))
})

// započinjemo sa igrom
go("game") 
