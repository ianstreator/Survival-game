const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const canWidth = canvas.width = window.innerWidth - 200;
const canHeight = canvas.height = window.innerHeight - 300;

window.addEventListener('resize', e => {
    canvas.width = window.innerWidth - 200;
    canvas.height = window.innerHeight - 300;
});
// CREATE PLAYER AND PLAYER CONTROLS-------------------------------------
class Player {
    constructor(x, y, r, color, speed, points, health) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.speed = speed;
        this.points = points
        this.health = health
    }
    draw() {
        this.update();

        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.shadowColor = 'white'
        c.shadowBlur = 50
        c.fill();
        c.textAlign = 'center'
        c.fillStyle = 'black'
        c.fillText(`${this.points}`, this.x, this.y)
        c.fillStyle = 'lime'
        c.fillText(`${this.health}`, this.x, this.y - 30)

    }
    update() {

    }
}
const colors = ['#66FF66', '#FFFF66', '#AAF0D1', '#FD5B78', '#50BFE6'];
const SC = colors[getRandomInt(1, 5)]
const player = new Player(canvas.width / 2, canvas.height / 2, 20, SC, 2, 0, 100);

const keys = [];

window.addEventListener('keydown', e => {
    keys[e.key] = true;
})

window.addEventListener('keyup', e => {
    delete keys[e.key]
})

function controls() {
    if (keys['a'] && player.x > 0 + player.r) {
        player.x -= player.speed;
    }
    if (keys['d'] && player.x < canvas.width - player.r) {
        player.x += player.speed;
    }
    if (keys['w'] && player.y > 0 + player.r) {
        player.y -= player.speed;
    }
    if (keys['s'] && player.y < canvas.height - player.r) {
        player.y += player.speed;
    }
}

class Food {
    constructor(x, y, r, color) {
        this.x = x,
            this.y = y,
            this.r = r,
            this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.shadowColor = this.color
        c.shadowBlur = this.r * 3
        c.fill()
    }
    update() {
        this.draw()
        foods.forEach((e, i) => {
            const dist = Math.hypot(player.x - e.x, player.y - e.y)
            if (dist < 50) {
                player.health += e.r
                foods.splice(i, 1)
            }
        })
    }
}

const foods = []
setInterval(() => {
    const x = getRandomInt(0, canWidth)
    const y = getRandomInt(0, canHeight)
    const r = getRandomInt(5, 15)
    const food = new Food(x, y, r, 'lime')
    if (foods.length < 10 && player.health < 75) {
        foods.push(food)
        console.log(foods)
    }
}, 2000);
//CREATE PROJECTILE--------------------------------------
class Projectile {
    constructor(x, y, r, color, velocity) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        projectiles.forEach((projectile, index) => {
            if (projectile.x < 0 ||
                projectile.x > canvas.width ||
                projectile.y < 0 ||
                projectile.y > canvas.height) {
                projectiles.splice(index, 1)
            }
        });
    }
}

const projectiles = [];
const projectile = new Projectile();


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

canvas.addEventListener('click', e => {
    const canvasX = e.clientX - canvas.getBoundingClientRect().x;
    const canvasY = e.clientY - canvas.getBoundingClientRect().y;
    const angle = Math.atan2(canvasY - player.y, canvasX - player.x);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    fadeText('bang', player.x + 40, player.y - 20)
    projectiles.push(new Projectile(player.x, player.y, 5, SC, velocity))
})
class SuperProjectile {
    constructor(x, y, r, color, velocity) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        projectiles.forEach((projectile, index) => {
            if (projectile.x < 0 ||
                projectile.x > canvas.width ||
                projectile.y < 0 ||
                projectile.y > canvas.height) {
                projectiles.splice(index, 1)
            }
        });
    }
}

const superProjectiles = [];
const superProjectile = new SuperProjectile();
canvas.addEventListener('contextmenu', e => {
    e.preventDefault()
    const canvasX = e.clientX - canvas.getBoundingClientRect().x;
    const canvasY = e.clientY - canvas.getBoundingClientRect().y;
    const angle = Math.atan2(canvasY - player.y, canvasX - player.x);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    if (player.points >= 100) {
        player.points -= 100
        superProjectiles.push(new SuperProjectile(player.x, player.y, 10, SC, velocity))
    }
})
//CREATE ENEMIES------------------------
class Enemy {
    constructor(x, y, r, color, velocity) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.shadowColor = 'black'
        c.shadowBlur = 25
        c.fill()
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        enemies.forEach((enemy, index) => {
            const dist2 = Math.hypot(player.x - enemy.x, player.y - enemy.y)
            if (dist2 - enemy.r - player.r < 1) {
                player.health -= 5
                enemies.splice(index, 1)
                if (player.health < 0) {
                    cancelAnimationFrame(animationID)
                }
            }
            projectiles.forEach((projectile, projectileIndex) => {
                const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
                if (dist - enemy.r - projectile.r < 1) {
                    enemy.r -= 4
                    player.points += 5
                    if (enemy.r < 1) {
                        enemies.splice(index, 1)
                        player.points += 50
                    }
                    projectiles.splice(projectileIndex, 1)
                }
            })
            superProjectiles.forEach((sp, spi) => {
                const dist = Math.hypot(sp.x - enemy.x, sp.y - enemy.y)
                if (dist - enemy.r - sp.r < 1) {
                    enemies.splice(index, 1)
                    superProjectiles.splice(spi, 1)
                }
            })
            const enemyDistFromPlayer = Math.hypot(player.x - this.x, player.y - this.y)
            if (enemyDistFromPlayer < this.r + player.r + 150) {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                const velocity = {
                    x: Math.cos(angle) * 1.25,
                    y: Math.sin(angle) * 1.25
                }
                this.velocity = velocity
                this.color = 'red'
            } else {
                this.color = 'orange'
            }
        })
    }
}

const enemies = [];
const enemy = new Enemy();

function spawnEnemies() {
    setInterval(() => {

        const r = getRandomInt(25, 30)

        if (Math.random() < 0.5) {
            x = (Math.random() < 0.5) ? 0 - r : canvas.width + r;
            y = getRandomInt(0, canvas.height);
        } else {
            x = getRandomInt(0, canvas.width);
            y = (Math.random() < 0.5) ? 0 - r : canvas.height + r;
        }

        const angle = Math.atan2(player.y - y, player.x - x);
        const velocity = {
            x: Math.cos(angle) * 3.5,
            y: Math.sin(angle) * 3.5
        }
        enemies.push(new Enemy(x, y, r, 'orange', velocity))
        enemies.forEach((enemy, index) => {
            if (enemy.x < 0 - enemy.r - 50 ||
                enemy.x > canvas.width + enemy.r + 50 ||
                enemy.y < 0 - enemy.r - 50 ||
                enemy.y > canvas.height + enemy.r + 50) {
                enemies.splice(index, 1)
            }
        });
    }, 500);

}
function fadeText(text, x, y) {
    c.fillStyle = 'white'
    c.textAlign = 'center'
    c.fillText(text, x, y--)
}
let animationID
function animate() {
    animationID = requestAnimationFrame(animate);
    // c.fillStyle = 'rgba(0,0,0,0.01)'
    // c.fillRect(0, 0, canvas.width, canvas.height);
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'white'
    c.textAlign = 'center'
    c.font = '20px cursive'
    c.fillText(enemies.length, 10, 20)
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
    });
    superProjectiles.forEach((projectile) => {
        projectile.update();
    });

    enemies.forEach((enemy) => {
        enemy.update();
    })
    foods.forEach((e, i) => {
        e.update()
    })
    controls();
    
}

animate();
spawnEnemies();