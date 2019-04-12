// -----------------------------------------------

function initLander () {
  let landerSVG = new Blob(['<svg width="684.55" height="414.59" enable-background="new" version="1.1" viewBox="0 0 181.12 109.69" xmlns="http://www.w3.org/2000/svg" xmlns:osb="http://www.openswatchbook.org/uri/2009/osb" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><radialGradient id="radialGradient4614" cx="105.64" cy="74.372" r="13.172" gradientTransform="matrix(1 0 0 1.9326 0 -69.357)" gradientUnits="userSpaceOnUse"><stop stop-color="#501616" offset="0"/><stop stop-color="#501616" stop-opacity="0" offset="1"/></radialGradient></defs><g fill-rule="evenodd" stroke="#501616"><ellipse cx="127.1" cy="76.105" rx="46.784" ry="11.254" fill="#9888ad" stroke-width=".43475"/><ellipse cx="57.176" cy="74.216" rx="46.784" ry="11.254" fill="#9888ad" stroke-width=".43475"/><ellipse cx="90.248" cy="84.421" rx="20.253" ry="14.395" fill="#ac9393" stroke-width=".20114"/><ellipse cx="91.004" cy="62.687" rx="55.302" ry="17.821" fill="#f60" stroke-width=".25722"/><ellipse cx="91.193" cy="49.08" rx="36.438" ry="39.272" fill="#241c1c" stroke-width=".71672"/></g><g transform="translate(-14.64 -39.844)" fill-rule="evenodd"><g stroke-width=".26458"><ellipse cx="105.83" cy="87.979" rx="30.994" ry="48.003" fill="#f60" stroke="#501616"/><ellipse cx="105.83" cy="73.994" rx="13.985" ry="27.97" fill="#000080" opacity=".82778" stroke="#501616"/><ellipse cx="105.64" cy="74.372" rx="13.04" ry="25.324" fill="#e3dbdb" opacity=".588" stroke="url(#radialGradient4614)"/></g><ellipse cx="110.75" cy="74.183" rx="4.5332" ry="19.085" fill="#e3dbdb" opacity=".198" stroke="#501616" stroke-width=".26966"/><ellipse cx="105.76" cy="117.27" rx="34.048" ry="2.8885" fill="#241c1c" stroke="#501616" stroke-width=".1879"/><g transform="matrix(-.43385 -1.5731 -1.2119 .84872 195.52 96.15)" stroke="#501616"><ellipse cx="51.027" cy="109.52" rx="7.1623" ry="21.147" fill="#f60" stroke-width=".30317"/><ellipse cx="50.649" cy="117.84" rx="1.9732" ry="8.0208" fill="#241c1c" stroke-width=".097998"/><ellipse cx="51.128" cy="99.961" rx="4.2185" ry="7.9982" fill="#241c1c" stroke-width=".14309"/></g><g transform="matrix(-1.8172 0 0 1.2271 197.88 -10.998)" stroke="#501616"><ellipse cx="51.027" cy="109.52" rx="7.1623" ry="21.147" fill="#f60" stroke-width=".30317"/><ellipse cx="50.94" cy="117.84" rx="1.9732" ry="8.0208" fill="#241c1c" stroke-width=".097998"/><ellipse cx="50.94" cy="99.696" rx="4.2185" ry="7.9982" fill="#241c1c" stroke-width=".14309"/></g><g transform="matrix(-1.4072 .82622 1.1335 .95095 117.14 -38.012)" stroke="#501616"><ellipse cx="51.027" cy="109.52" rx="7.1623" ry="21.147" fill="#f60" stroke-width=".30317"/><ellipse cx="50.649" cy="117.84" rx="1.9732" ry="8.0208" fill="#241c1c" stroke-width=".097998"/><ellipse cx="51.134" cy="99.832" rx="4.2185" ry="7.9982" fill="#241c1c" stroke-width=".14309"/></g></g></svg>'], { type: 'image/svg+xml' })
  let url = window.URL.createObjectURL(landerSVG)
  lander.addEventListener('load', initLanderData)
  lander.src = url

  function initLanderData () {
    game.landerWidth = lander.naturalWidth * game.landerScale
    game.landerHeight = lander.naturalHeight * game.landerScale
  }

  game.landerSpeedX = 0
  game.landerSpeedY = 0
}

// -----------------------------------------------

function clearStage () {
  dc.clip(clearRect)
  dc.fillStyle = 'rgba(50,50,70,1)'
  dc.fill(clearRect)
}

// -----------------------------------------------

function drawLanderSVG () {
  let newAngle = (Math.PI / 180) * game.landerAngle

  dc.translate(game.landerX, game.landerY)
  dc.rotate(newAngle)

  dc.drawImage(lander, -(game.landerWidth * 0.5), -(game.landerHeight * 0.5), game.landerWidth, game.landerHeight)
  let hitboxLeft = new Path2D()
  let hitboxRight = new Path2D()
  let hitboxCenter = new Path2D()
  let hitboxTop = new Path2D()

  hitboxLeft.rect(game.landerWidth * -0.5, game.landerHeight * 0.25, game.landerWidth * 0.3, game.landerHeight * 0.275)
  hitboxRight.rect(game.landerWidth * 0.2, game.landerHeight * 0.25, game.landerWidth * 0.3, game.landerHeight * 0.275)
  hitboxCenter.rect(game.landerWidth * -0.25, game.landerHeight * 0.45, game.landerWidth * 0.5, game.landerHeight * 0.075)
  hitboxTop.arc(0, game.landerHeight * 0.25, game.landerHeight * 0.85, Math.PI * 1, 0)

  game.landerHitBoxes.length = 0
  game.landerHitBoxes = [hitboxTop, hitboxLeft, hitboxRight, hitboxCenter]

  // for (let hitbox of game.landerHitBoxes) dc.fill(hitbox)

  dc.rotate(-newAngle)
  dc.translate(-game.landerX, -game.landerY)
}

// -----------------------------------------------

function checkCollision () {
  if (game.finished) return

  if (game.landerX < 0 || game.landerX > stage.width) {
    game.finished = true
    game.won = false

    sprayEnvParticle('explosion')
    window.requestAnimationFrame(draw)
    return
  }

  if (game.landerY + game.landerHeight + 30 < game.terrainMax) return

  let currentX = -game.landerWidth * 0.5
  let currentY = -game.landerHeight
  let scanMaxX = game.landerWidth
  let scanMaxY = game.landerHeight

  let newAngle = (Math.PI / 180) * game.landerAngle

  dc.translate(game.landerX, game.landerY)
  dc.rotate(newAngle)

  let hitboxes = 0
  let hitboxIndex = 0
  while (currentY < scanMaxY) {
    while (currentX < scanMaxX) {
      dc.rotate(-newAngle)
      dc.translate(-game.landerX, -game.landerY)
      if (dc.isPointInPath(game.terrain, game.landerX + currentX, game.landerY + currentY)) {
        dc.translate(game.landerX, game.landerY)
        dc.rotate(newAngle)

        hitboxes = 0
        hitboxIndex = 0
        for (let hitbox of game.landerHitBoxes) {
          if (dc.isPointInPath(hitbox, game.landerX + currentX, game.landerY + currentY)) {
            ++hitboxes

            if (hitboxIndex === 0) break
          }

          ++hitboxIndex
        }

        if (hitboxes !== 0) {
          if (hitboxIndex === 0 || (Math.abs(game.landerSpeedX) > game.maxCollisionSpeed || Math.abs(game.landerSpeedY > game.maxCollisionSpeed)) || (Math.abs(game.landerAngle) > game.maxAngle)) {
            dc.rotate(-newAngle)
            dc.translate(-game.landerX, -game.landerY)
            game.finished = true
            game.won = false

            sprayEnvParticle('explosion')
            window.requestAnimationFrame(draw)
            return
          } else if (hitboxes >= 2) {
            dc.rotate(-newAngle)
            dc.translate(-game.landerX, -game.landerY)
            game.won = true
            game.finished = true
            window.requestAnimationFrame(draw)
            return
          }
        }

        dc.rotate(-newAngle)
        dc.translate(-game.landerX, -game.landerY)
      }

      dc.translate(game.landerX, game.landerY)
      dc.rotate(newAngle)
      currentX += 1
    }

    currentX = -game.landerWidth * 0.5
    ++currentY
  }

  dc.rotate(-newAngle)
  dc.translate(-game.landerX, -game.landerY)
}

// -----------------------------------------------

function draw () {
  if (game.hasTimeout !== null) return
  clearStage()
  if (game.terrainImg !== null) dc.putImageData(game.terrainImg, 0, stage.height - game.terrainImg.height)

  animateParticles()
  drawFuel()
  drawStats()
  calculateWind()

  if (game.terrainImg === null) drawTerrain()
  checkCollision()

  if (!game.finished || game.won) {
    drawLanderSVG()

    if (!game.won) {
      game.landerSpeedX += game.moonWindStrengthX * 0.005
      game.landerSpeedY += game.moonWindStrengthY * 0.005
      game.landerSpeedY += Math.sqrt(2 * game.moonGravity) * 0.005
      game.landerX += game.landerSpeedX
      game.landerY += game.landerSpeedY
    }
  }

  if (game.finished) {
    if (game.engineParticles.length === 0 && game.landerParticles.length === 0) return
    window.requestAnimationFrame(draw)
    return
  }

  window.requestAnimationFrame(draw)
}

// -----------------------------------------------

function drawTerrain () {
  dc.fillStyle = 'rgba(170,140,140,0.7)'
  dc.strokeStyle = 'rgba(250,250,250,0.85)'
  dc.strokeWidth = 3
  dc.fill(game.terrain)
  dc.stroke(game.terrain)
  dc.translate(0, 3)
  dc.fill(game.terrain)
  dc.translate(0, 6)
  dc.fill(game.terrain)
  dc.translate(0, -9)
}

// -----------------------------------------------
function drawFuel () {
  dc.fillStyle = 'rgba(255,255,255,0.7)'
  dc.fillRect(10, 10, 20, 100)
  dc.fillStyle = 'rgba(0,0,0,0.4)'
  dc.fillRect(10, 10, 20, 100 - (100 * game.landerFull))
  dc.translate(14, 80)
  dc.rotate((Math.PI / 180) * -90)
  dc.fillStyle = 'rgba(255,255,255,0.75)'
  dc.fillText('FUEL', 10, 10)
  dc.rotate((Math.PI / 180) * 90)
  dc.translate(-14, -80)
}

function drawStats () {
  dc.fillStyle = 'rgba(255,255,255,0.7)'
  dc.fillText('SPEED X: ' + game.landerSpeedX.toFixed(2) + ' m/s²', 10, 150)
  dc.fillText('SPEED Y: ' + game.landerSpeedY.toFixed(2) + ' m/s²', 10, 164)
  dc.fillText('ANGLE: ' + game.landerAngle + ' ° Grad', 10, 188)
  dc.fillText('WIND X: ' + game.moonWindStrengthX.toFixed(2) + ' m/s²', 10, 218)
  dc.fillText('WIND Y: ' + game.moonWindStrengthY.toFixed(2) + ' m/s²', 10, 232)
}

// -----------------------------------------------
function sprayEnvParticle (type) {
  switch (type) {
    case 'explosion':
      let srcX = game.landerX
      let srcY = game.landerY
      let maxWaves = [24, 16, 12, 5, 2, 1]
      for (let waveSize of maxWaves) {
        for (let angle = 0; angle < 360; ++angle) {
          let angleX = -Math.cos(angle / 180 * Math.PI)
          let angleY = -Math.sin(angle / 180 * Math.PI)

          for (let i = 0; i < game.landerParticleSprayCount * 0.05; ++i) {
            let particle = {
              x: srcX,
              y: srcY,
              age: 0.8 + (waveSize * 0.025),
              speedX: angleX * (Math.random() * waveSize + 0.95),
              speedY: angleY * (Math.random() * waveSize + 0.95)
            }

            game.engineParticles.push(particle)
          }
        }
      }
      break
    default:
      break
  }
}

function sprayParticle (direction) {
  let srcX = game.landerX
  let srcY = game.landerY
  let engineAngle = 0
  let angle = 0

  switch (direction) {
    case 0:
      // DOWN
      angle = (game.landerAngle - 90) / 180 * Math.PI
      srcX -= Math.cos(angle) * game.landerWidth * 0.375
      srcY -= Math.sin(angle) * game.landerHeight * 0.6
      break
    case 2:
      // LEFT
      engineAngle = 55
      angle = (game.landerAngle - 90 + 65) / 180 * Math.PI
      srcX -= Math.cos(angle) * game.landerWidth * 0.55
      srcY -= Math.sin(angle) * game.landerHeight * 0.9
      break
    case 1:
      // RIGHT
      engineAngle = -55
      angle = (game.landerAngle - 90 - 65) / 180 * Math.PI
      srcX -= Math.cos(angle) * game.landerWidth * 0.55
      srcY -= Math.sin(angle) * game.landerHeight * 0.9
      break
    default:
      return
  }

  let angleX = Math.cos((game.landerAngle + 90 + engineAngle) / 180 * Math.PI)
  let angleY = Math.sin((game.landerAngle + 90 + engineAngle) / 180 * Math.PI)
  for (let i = 0; i < game.landerParticleSprayCount; ++i) {
    let particle = {
      x: srcX,
      y: srcY,
      age: 0.9,
      speedX: angleX * (Math.random() * 5 + 0.95),
      speedY: angleY * (Math.random() * 5 + 0.95)
    }
    game.landerParticles.push(particle)
  }
}

function animateParticles () {
  let angle = 2 * Math.PI
  dc.strokeStyle = 'rgba(255,255,255,0.75)'
  dc.strokeWidth = 1

  let particleSrcs = [game.landerParticles, game.engineParticles]
  for (let x = 0; x < particleSrcs.length; ++x) {
    let particles = particleSrcs[x]
    if (particles[0] === undefined) continue
    for (let i = 0, count = particles.length; i < count; ++i) {
      let particle = particles[i]
      dc.beginPath()
      dc.arc(particle.x, particle.y, 2, 0, angle)
      particle.age -= 0.05
      dc.strokeStyle = 'rgba(255,255,255,' + particle.age.toString() + ')'
      dc.stroke()

      if (particle.age <= 0) {
        particles.splice(i, 1)
        --count
        --i
        continue
      }

      particle.x += particle.speedX
      particle.y += particle.speedY
    }
  }
}

function handleKeydown (evt) {
  if (evt.target.nodeName === 'INPUT') return
  if (game.landerFull <= 0) return

  switch (evt.keyCode) {
    case 32:
      evt.stopPropagation()
      evt.preventDefault()
      restartGame()
      break
    case 37:
    case 65:
      if (game.finished) return
      game.landerAngle -= 1
      game.landerSpeedX += Math.cos((game.landerAngle - 90 - 55) / 180 * Math.PI) * 0.025
      game.landerSpeedY += Math.sin((game.landerAngle - 90 - 55) / 180 * Math.PI) * 0.025
      game.landerFull -= game.fuelConsumption
      if (Math.abs(game.landerAngle) >= 360) game.landerAngle = 360 - Math.abs(game.landerAngle)
      sprayParticle(1)
      evt.stopPropagation()
      evt.preventDefault()
      break
    case 39:
    case 68:
      if (game.finished) return
      game.landerAngle += 1
      game.landerSpeedX -= Math.cos((game.landerAngle - 90 - 55) / 180 * Math.PI) * 0.025
      game.landerSpeedY -= Math.sin((game.landerAngle - 90 - 55) / 180 * Math.PI) * 0.025
      game.landerFull -= game.fuelConsumption
      if (Math.abs(game.landerAngle) >= 360) game.landerAngle = 360 - Math.abs(game.landerAngle)
      sprayParticle(2)
      evt.stopPropagation()
      evt.preventDefault()
      break
    case 38:
    case 87:
      if (game.finished) return
      game.landerSpeedX += Math.cos((game.landerAngle - 90) / 180 * Math.PI) * 0.025
      game.landerSpeedY += Math.sin((game.landerAngle - 90) / 180 * Math.PI) * 0.025
      game.landerFull -= game.fuelConsumption
      sprayParticle(0)
      evt.stopPropagation()
      evt.preventDefault()
      break
    default:
      break
  }
}

function calculateWind () {
  if (!game.moonWindEnabled) return
  game.moonWindAngle += (Math.random() * -1) * ((Math.random() * 30) - 15)

  game.moonWindStrengthX = Math.cos(game.moonWindAngle / 180 * Math.PI)
  if (Math.abs(game.moonWindStrengthX) > game.moonWindMaxStrength) game.moonWindMaxStrengthX = game.moonWindStrengthX > 0 ? game.moonWindMaxStrength : -game.moonWindMaxStrength

  game.moonWindStrengthY = Math.sin(game.moonWindAngle / 180 * Math.PI)
  if (Math.abs(game.moonWindStrengthY) > game.moonWindMaxStrength) game.moonWindMaxStrengthX = game.moonWindStrengthY > 0 ? game.moonWindMaxStrength : -game.moonWindMaxStrength

  dc.translate(90, 60)
  dc.rotate((Math.PI / 180) * game.moonWindAngle)
  dc.fillStyle = 'rgba(255,255,255,0.48)'
  dc.beginPath()
  dc.arc(0, 0, 50, 50, 0, 2 * Math.PI)
  dc.closePath()
  dc.fill()

  dc.fillStyle = 'rgba(0,0,0,0.18)'
  dc.beginPath()
  dc.arc(0, 0, 40, 40, 0, 2 * Math.PI)
  dc.closePath()
  dc.fill()

  dc.fillStyle = 'rgba(255,255,255,0.68)'
  dc.strokeStyle = 'rgba(0,0,0,0.318)'
  dc.beginPath()
  dc.translate(-20, -5)
  dc.moveTo(0, 0)
  dc.lineTo(25, 0)
  dc.lineTo(25, -10)
  dc.lineTo(45, 5)
  dc.lineTo(25, 20)
  dc.lineTo(25, 10)
  dc.lineTo(0, 10)
  dc.closePath()
  dc.fill()
  dc.stroke()
  dc.translate(20, 5)
  dc.rotate((Math.PI / 180) * -game.moonWindAngle)
  dc.translate(-90, -60)
}

// ----------------------------------------------------------------------------

function generateTerrain () {
  let iterations = 50
  let min = 30
  let max = 30
  let rareStep = 0.0
  let randomValues = []
  for (let x = 0; x < iterations; ++x) {
    randomValues.push([max * (Math.random() * 1) + min, min, rareStep])
    rareStep = (Math.random() * 0.125) + 0.0155
    max += 3
    min -= 1
  }

  let terrain = []
  for (let randomLimits of randomValues) {
    let lastTime = stage.width * (Math.random() * randomLimits[2])
    for (let x = 0, width = stage.width + 150; x < width; ++x) {
      if (--lastTime < 0) {
        lastTime = stage.width * (Math.random() * randomLimits[2])
        let randomVal = Math.random() * randomLimits[0] + randomLimits[1]
        if (terrain[x] === undefined) terrain.push(randomVal)
        else terrain[x] += randomVal
      }
    }
  }

  let offsetY = stage.height
  let terrainPath = new Path2D()
  terrainPath.moveTo(0, offsetY)

  for (let x = 0, size = terrain.length - 1; x < size; x += Math.round(Math.random() * (stage.width * 0.05)) + 30) {
    terrainPath.lineTo(x, offsetY - terrain[x])
    if (game.terrainMax < terrain[x]) game.terrainMax = terrain[x] + 20
  }

  game.terrainMax = offsetY - game.terrainMax
  terrainPath.lineTo(stage.width, offsetY)
  terrainPath.lineTo(0, offsetY)
  terrainPath.closePath()

  game.terrain.addPath(terrainPath)

  dc.fillStyle = 'rgba(170,140,140,0.4)'
  dc.strokeStyle = 'rgba(250,250,250,0.55)'
  dc.strokeWidth = 6
  dc.fill(game.terrain)
  dc.stroke(game.terrain)
  dc.translate(0, 3)
  dc.fill(game.terrain)
  dc.translate(0, 6)
  dc.fill(game.terrain)

  dc.translate(0, -9)
}

// -----------------------------------------------

function generateTerrain2 () {
  function interpolate (pa, pb, px) {
    let ft = px * Math.PI
    let f = (1 - Math.cos(ft)) * 0.5
    return pa * (1 - f) + pb * f
  }

  let h = stage.height
  let w = stage.width + 25
  let x = 0
  let y = h * 0.65
  let amp = 240 // amplitude
  let wl = 140 // wavelength

  let a = Math.random()
  let b = Math.random()

  let terrainPath = new Path2D()
  game.terrainMax = stage.height
  terrainPath.moveTo(x, h)

  while (x < w) {
    if (x % wl === 0) {
      a = b
      b = Math.random()
      y = h * 0.65 + a * amp
    } else {
      y = h * 0.65 + interpolate(a, b, (x % wl) / wl) * amp
    }

    terrainPath.lineTo(x, y)
    if (Math.abs(y) < game.terrainMax) game.terrainMax = Math.abs(y)
    x += 10
  }

  terrainPath.lineTo(stage.width + 15, game.terrainMax * 1.05)
  terrainPath.lineTo(stage.width + 15, h)
  terrainPath.lineTo(0, h)
  terrainPath.closePath()

  game.terrain.addPath(terrainPath)

  dc.fillStyle = 'rgba(170,140,140,0.4)'
  dc.strokeStyle = 'rgba(250,250,250,0.55)'
  dc.strokeWidth = 6
  dc.stroke(game.terrain)
  dc.fill(game.terrain)
  dc.translate(0, 3)
  dc.fill(game.terrain)
  dc.translate(0, 6)
  dc.fill(game.terrain)
  dc.translate(0, -9)

  clearStage()
  drawTerrain()
  if (game.preFetchTerrain) game.terrainImg = dc.getImageData(0, stage.height - game.terrainMax, stage.width, game.terrainMax)
}

// -----------------------------------------------

const stage = document.querySelector('#stage')
const dc = stage.getContext('2d')

let clearRect = new Path2D()
clearRect.rect(0, 0, stage.width, stage.height)

const fuelConsumptionDivider = 0.00001

let game = {
  terrainType: 1,
  terrain: new Path2D(),
  terrainImg: null,
  preFetchTerrain: false,
  terrainMax: 0,
  hasTimeout: null,
  moonWindEnabled: true,
  moonWindAngle: 0,
  moonWindMaxStrength: 2,
  moonWindStrengthX: 0,
  moonWindStrengthY: 0,
  moonGravity: 1.62,
  maxAngle: 43,
  maxCollisionSpeed: 1.275,
  fuelConsumption: 125 * fuelConsumptionDivider,
  landerX: stage.width * 0.3,
  landerY: 10,
  landerAngle: 0,
  landerWidth: 0,
  landerHeight: 0,
  landerScale: 0.1,
  landerSpeedX: 0,
  landerSpeedY: 0,
  landerParticleSprayCount: 25,
  landerFull: 1.0,
  landerHitBoxes: [],
  finished: false,
  won: false,
  landerParticles: [],
  engineParticles: []
}

// -----------------------------------------------
function resetGame () {
  game.landerParticles.length = 0
  game.engineParticles.length = 0
  game.landerHitBoxes.length = 0
  game.terrain = null
  game.terrainImg = null

  game = {
    terrainType: 1,
    terrain: new Path2D(),
    terrainImg: null,
    preFetchTerrain: false,
    terrainMax: 0,
    hasTimeout: null,
    moonWindEnabled: true,
    moonWindAngle: 0,
    moonWindMaxStrength: 2,
    moonWindStrengthX: 0,
    moonWindStrengthY: 0,
    moonGravity: 1.62,
    maxAngle: 43,
    maxCollisionSpeed: 1.275,
    fuelConsumption: 125 * fuelConsumptionDivider,
    landerX: stage.width * 0.3,
    landerY: 10,
    landerAngle: 0,
    landerWidth: 0,
    landerHeight: 0,
    landerScale: 0.1,
    landerSpeedX: 0,
    landerSpeedY: 0,
    landerParticleSprayCount: 25,
    landerFull: 1.0,
    landerHitBoxes: [],
    finished: true,
    won: false,
    landerParticles: [],
    engineParticles: []
  }

  dc.setTransform(1, 0, 0, 1, 0, 0)
}

function readUIOptionValues () {
  let optionFields = document.querySelectorAll('.optionValue')
  for (let option of optionFields) {
    if (option.type === 'number') {
      if (option.name === 'fuelConsumption') game[option.name] = parseFloat(option.value) * fuelConsumptionDivider
      else game[option.name] = parseFloat(option.value)
    } else if (option.type === 'radio') {
      if (option.checked) {
        let isBool = game[option.name] === true || game.optionName === false
        game[option.name] = isBool ? parseInt(option.value) === 1 : parseInt(option.value)
      }
    }
  }
}

function resetTimeout () {
  clearTimeout(game.hasTimeout)
  game.hasTimeout = null
  window.requestAnimationFrame(draw)
}

function restartGame () {
  if (game.hasTimeout !== null) return
  resetGame()
  game.finished = false
  game.won = false
  readUIOptionValues()

  clearStage()
  if (game.terrainType <= 0) generateTerrain()
  else generateTerrain2()

  initLander()

  game.hasTimeout = setTimeout(resetTimeout, 150)
}

// -----------------------------------------------
for (let node of document.querySelectorAll('.optionValue')) node.addEventListener('change', readUIOptionValues)

document.addEventListener('keydown', handleKeydown)

let lander = new Image()
initLander()

restartGame()
