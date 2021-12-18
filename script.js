//window.location.reload(true)
var phy
levelElements=[]
levelText=''
levels=[]
levelTitles=[]
curLevel = 0
curLevelArray=[]
prevLevelState=""
cancelMovement=false
won=false
function preload() {
	this.load.image('player1', 'assets/sprites/char/frame1.png')
	this.load.image('player2', 'assets/sprites/char/frame2.png')
	this.load.image('player1b', 'assets/sprites/char/frame1b.png')
	this.load.image('player2b', 'assets/sprites/char/frame2b.png')
	this.load.image('brick', 'assets/sprites/brick.png')
	this.load.image('tile', 'assets/sprites/tile.png')
	this.load.image('background', 'assets/sprites/background.png')
	this.load.image('debug','assets/sprites/reference.png')
	this.load.image('door1','assets/sprites/door/door1.png')
	this.load.image('door2','assets/sprites/door/door2.png')
	this.load.image('enemyL','assets/sprites/enemy/left.png')
	this.load.image('enemyR','assets/sprites/enemy/right.png')
	this.load.image('lava', 'assets/sprites/lava.png')
	this.load.image('bars', 'assets/sprites/bar.png')
}
function twoKeysDownNonEngine(k0,k1){
	return k0.isDown||k1.isDown
}
fetch('assets/data/level.dat').then(function(response) {
	response.text().then(function(text) {
		levelText = text
		var tempLevels = levelText.split("\n|\n")
		for(thing in tempLevels){
			tempLevels[thing]=tempLevels[thing].split("\n||\n")
		}
		for(thing in tempLevels){
			levels.push(tempLevels[thing][1])
			levelTitles.push(tempLevels[thing][0])
		}
		for(var i = 0; i < levels.length; i++) {
			levels[i] = levels[i].split("\n")
		}
		for(var v = 0; v < this.levels.length; v++) {
			var lvl = levels[v]
			for(var i = 0; i < lvl.length; i++){
				levels[v][i] = levels[v][i].split('')
			}
		}
		curLevelArray=levels[curLevel]
	})
})
function create() {
	let cursors = this.input.keyboard.createCursorKeys();
	this.up = function(){
		if(cancelMovement){return false}else{
		return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W).isDown||cursors.up.isDown
	}}
	this.left = function(){
		if(cancelMovement){return false}else{
		return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A).isDown||cursors.left.isDown
	}}
	this.down = function(){
		if(cancelMovement){return false}else{
		return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S).isDown||cursors.down.isDown
	}}
	this.right = function(){
		if(cancelMovement){return false}else{
		return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D).isDown||cursors.right.isDown
	}}
	this.reset = function(){
		return this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R).isDown
	}
	phy = this.physics
	//this.test = this.physics.add.image(0, 0, 'debug').setScale(3, 3)
	this.player = this.physics.add.image(0, 0, 'player1').setScale(3, 3)
	this.player.setDepth(1);
	this.cameras.main.startFollow(this.player);
	//this.player.setCollideWorldBounds(true);
	this.rightAllow=true
	this.leftAllow=true
	this.downAllow=true
	this.upAllow=true
	this.player.walkDelay=300
	this.player.idleDelay=500
	this.player.moveAmount=16*3
	this.player.idle1 = true
	this.player.blink = false
	var timer = this.time.addEvent({
		delay:this.player.idleDelay,
		callback: ()=>{
			if(this.player.idle){
				this.player.idle = false
				if(this.player.blink){
					this.player.setTexture('player2b');
				}else{
					this.player.setTexture('player2');
				}
			}else{
				this.player.idle = true
				if(this.player.blink){
					this.player.setTexture('player1b');
				}else{
					this.player.setTexture('player1');
				}
			}
			
		},
		loop:true
	})
	this.randomNumber = function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	this.player.blinkTimeRange=[1000,6000]
	this.player.blinkDelay= this.time.addEvent({
		delay:this.randomNumber(
			this.player.blinkTimeRange[0],
			this.player.blinkTimeRange[1]
		),
		callback: ()=>{
			this.player.blink = true
			this.time.addEvent({
				delay:250,
				callback: ()=>{
					this.player.blink=false
				}
			})
			this.player.blinkDelay.delay=this.randomNumber(
				this.player.blinkTimeRange[0],
				this.player.blinkTimeRange[1]
			)
		},
		loop:true
	})
	for(y in curLevelArray){
		for(x in curLevelArray[y]){
			var curChar = curLevelArray[y][x]
			if(curChar == "-"){
				this.player.x = x*(16*3)
				this.player.y = y*(16*3)
			}
		}
	}
}
function unRender(){
	for(sprite in this.levelElements){
		this.levelElements[sprite].destroy()
	}
	for(i in this.levelElements){
		this.levelElements.pop()
	}
}
function render(){
	document.getElementById("levelTitle").innerHTML = levelTitles[curLevel]
	unRender()
	for(y in curLevelArray){
		for(x in curLevelArray[y]){
			var curChar = curLevelArray[y][x]
			switch(curChar){
				case "#":
					var backSprite = phy.add.image(x*(16*3), y*(16*3), 'background').setScale(3, 3);
					this.levelElements.push(backSprite)
					break
				case "-":
					var backSprite = phy.add.image(x*(16*3), y*(16*3), 'background').setScale(3, 3);
					this.levelElements.push(backSprite)
					break
				case ">":
					var backSprite = phy.add.image(x*(16*3), y*(16*3), 'background').setScale(3, 3);
					var enemySprite = phy.add.image(x*(16*3), y*(16*3), 'enemyR').setScale(3, 3);
					this.levelElements.push(enemySprite)
					this.levelElements.push(backSprite)
					break
				case "<":
					var backSprite = phy.add.image(x*(16*3), y*(16*3), 'background').setScale(3, 3);
					var enemySprite = phy.add.image(x*(16*3), y*(16*3), 'enemyL').setScale(3, 3);
					this.levelElements.push(enemySprite)
					this.levelElements.push(backSprite)
					break
				case "=":
					var wallSprite = phy.add.image(x*(16*3), y*(16*3), 'brick').setScale(3, 3);
					this.levelElements.push(wallSprite)
					break
				case "+":
					var doorSprite = phy.add.image(x*(16*3), y*(16*3), 'door2').setScale(3, 3);
					this.levelElements.push(doorSprite)
					break
				case "~":
					var lavaSprite = phy.add.image(x*(16*3), y*(16*3), 'lava').setScale(3, 3);
					this.levelElements.push(lavaSprite)
					break
				case "_":
					var backSprite = phy.add.image(x*(16*3), y*(16*3), 'background').setScale(3, 3);
					var barSprite = phy.add.image(x*(16*3), y*(16*3), 'bars').setScale(3, 3);
					this.levelElements.push(backSprite)
					this.levelElements.push(barSprite)
					break
				case "|":
					var backSprite = phy.add.image(x*(16*3), y*(16*3), 'background').setScale(3, 3);
					var barSprite = phy.add.image(x*(16*3), y*(16*3), 'bars').setScale(3, 3);
					this.levelElements.push(backSprite)
					this.levelElements.push(barSprite)
					break
				case " ":
					break
				default:
					var error = phy.add.image(x*(16*3), y*(16*3), 'debug').setScale(3, 3);
					this.levelElements.push(error)
					break
			}
		}
	}
}
function findYX(){
	var arrayYX = []
	for(y in curLevelArray){
		for(x in curLevelArray[y]){
			if(curLevelArray[y][x]=='-'){
				arrayYX[0]=parseInt(y,10)
				arrayYX[1]=parseInt(x,10)
			}
		}
	}
	return arrayYX
}
function resetLevel(){//Very Un-Optimized
	cancelMovement=true
	var tempLevels = levelText.split("\n|\n")
	levels = []
	for(thing in tempLevels){
		tempLevels[thing]=tempLevels[thing].split("\n||\n")
	}
	for(thing in tempLevels){
		levels.push(tempLevels[thing][1])
		levelTitles.push(tempLevels[thing][0])
	}
	for(var i = 0; i < levels.length; i++) {
		levels[i] = levels[i].split("\n")
	}
	for(var v = 0; v < this.levels.length; v++) {
		var lvl = levels[v]
		for(var i = 0; i < lvl.length; i++){
			levels[v][i] = levels[v][i].split('')
		}
	}
	curLevelArray=levels[curLevel]
}
function moveEnemys(){
	var enemyArray = []
	for(y in curLevelArray){
		for(x in curLevelArray[y]){
			if(curLevelArray[y][x]=='<'||curLevelArray[y][x]=='>'){
				enemyArrayArray = [parseInt(y,10),parseInt(x,10),curLevelArray[y][x]]
				enemyArray.push(enemyArrayArray)
			}
		}
	}
	for(enemy in enemyArray){
		enemy = enemyArray[enemy]
		var offsetX = parseInt(0,10)
		var offsetY = parseInt(0,10)
		if(enemy[2] == '>'){
			offsetX+=1
		}else if(enemy[2] == '<'){
			offsetX-=1
		}
		switch(curLevelArray[enemy[0]+offsetY][enemy[1]+offsetX]){
			case "#":
				if(enemy[2] == '>'){
					curLevelArray[enemy[0]+offsetY][enemy[1]+offsetX]='>'
				}else if(enemy[2] == '<'){
					curLevelArray[enemy[0]+offsetY][enemy[1]+offsetX]='<'
				}
				curLevelArray[enemy[0]][enemy[1]]='#'
				break
			case "~":
				curLevelArray[enemy[0]][enemy[1]]='#'
				break
			case "-":
				resetLevel()
				dead=true
				return
				break
			default:
				if(enemy[2] == '>'){
					curLevelArray[enemy[0]][enemy[1]]='<'
				}else if(enemy[2] == '<'){
					curLevelArray[enemy[0]][enemy[1]]='>'
				}
				break
		}
	}
}
function movePlr(dir,plr){
	moveEnemys()
	var yx = findYX()
	var difX = 0
	var difY = 0
	switch(dir){
		case "up":
			difY=-1
			difX=0
			switch(curLevelArray[yx[0]+difY][yx[1]+difX]){
				case "#":
					curLevelArray[yx[0]+difY][yx[1]+difX] = "-"
					curLevelArray[yx[0]][yx[1]] = "#"
					break
				case "+":
					curLevel+=1
					curLevelArray = levels[curLevel]
					break
				case "~":
					resetLevel()
					break
				case ">":
					resetLevel()
					break
				case "<":
					resetLevel()
					break
			}
			break
		case "down":
			difY=1
			difX=0
			switch(curLevelArray[yx[0]+difY][yx[1]+difX]){
				case "#":
					curLevelArray[yx[0]+difY][yx[1]+difX] = "-"
					curLevelArray[yx[0]][yx[1]] = "#"
					break
				case "+":
					curLevel+=1
					curLevelArray = levels[curLevel]
					break
				case "~":
					resetLevel()
					break
				case ">":
					resetLevel()
					break
				case "<":
					resetLevel()
					break
			}
			break
		case "left":
			difY=0
			difX=-1
			switch(curLevelArray[yx[0]+difY][yx[1]+difX]){
				case "#":
					curLevelArray[yx[0]+difY][yx[1]+difX] = "-"
					curLevelArray[yx[0]][yx[1]] = "#"
					break
				case "+":
					curLevel+=1
					curLevelArray = levels[curLevel]
					break
				case "~":
					resetLevel()
					break
				case ">":
					resetLevel()
					break
				case "<":
					resetLevel()
					break
			}
			break
		case "right":
			difY=0
			difX=1
			switch(curLevelArray[yx[0]+difY][yx[1]+difX]){
				case "#":
					curLevelArray[yx[0]+difY][yx[1]+difX] = "-"
					curLevelArray[yx[0]][yx[1]] = "#"
					break
				case "+":
					curLevel+=1
					curLevelArray = levels[curLevel]
					break
				case "~":
					resetLevel()
					break
				case ">":
					resetLevel()
					break
				case "<":
					resetLevel()
					break
			}
			break
	}
	yx = findYX()
	plr.x = yx[1]*(16*3)
	plr.y = yx[0]*(16*3)
}
function lvlOneLineString(lvl) {
	toReturn = ""
	for(y in lvl){
		for(x in lvl[y]){
			if(lvl[y][x]!="-"){//optimization kinda
				toReturn+=lvl[y][x]
			}else{
				toReturn+="#"
			}
		}
	}
	return toReturn
}
function update() {
	if(won){
		render()
		if(this.reset()){
			resetLevel
			curLevel=0
			curLevelArray=levels[0]
			won=false
			render()
		}
	}else{
		if(curLevel==levels.length-1){
			won=true
		}else{
			if (this.right()&&this.rightAllow){
				movePlr("right",this.player)
				this.rightAllow=false
				//this.player.x+=this.player.moveAmount
				var timer = this.time.addEvent({
					delay:this.player.walkDelay,
					callback: ()=>{
						this.rightAllow=true
					}
				})
			}if (this.left()&&this.leftAllow){
				movePlr("left",this.player)
				this.leftAllow=false
				//this.player.x-=this.player.moveAmount
				var timer = this.time.addEvent({
					delay:this.player.walkDelay,
					callback: ()=>{
						this.leftAllow=true
					}
				})
			}if (this.down()&&this.downAllow){
				movePlr("down",this.player)
				this.downAllow=false
				//this.player.y+=this.player.moveAmount
				var timer = this.time.addEvent({
					delay:this.player.walkDelay,
					callback: ()=>{
						this.downAllow=true
					}
				})
			}if (this.up()&&this.upAllow){
				movePlr("up",this.player)
				this.upAllow=false
				//this.player.y-=this.player.moveAmount
				var timer = this.time.addEvent({
					delay:this.player.walkDelay,
					callback: ()=>{
						this.upAllow=true
					}
				})
			}
			cancelMovement=false
			if(prevLevelState!=lvlOneLineString(curLevelArray)){
				render()
			}
			prevLevelState=lvlOneLineString(curLevelArray)
		}
	}
	/*if ((cursors.left.isDown || this.a.isDown) || (cursors.right.isDown || this.d.isDown)) this.player.setVelocityX(cursors.left.isDown || this.a.isDown ? -160 : 160);
	else this.player.setVelocityX(0);
	if ((cursors.up.isDown || this.w.isDown) || (cursors.down.isDown || this.s.isDown)) this.player.setVelocityY(cursors.up.isDown || this.w.isDown ? -160 : 160);
	else this.player.setVelocityY(0);*/
}

const config = {
		antialias: false,
		crisp: true,
		renderer: Phaser.CANVAS,
    type: Phaser.AUTO,
    width: 500,
    height: 400,
    backgroundColor: "#5c5c5c",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);