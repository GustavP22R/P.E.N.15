class bullet{
    constructor(){
        this.x = playerz + 570
        this.y = playery - 400
        this.z = playerx - 570

        this.speed = 100

        this.xangle = player.lookAngle.x - 10
        this.yangle = player.lookAngle.y
    }
    update(){
        this.z -= sin(this.yangle)*this.speed
        this.x -= cos(this.yangle)*this.speed
        this.y -= sin(this.xangle)*this.speed
    }
    draw(){
        push()
        rotateX(90)
        rotateY(-90)
        translate(this.x, this.y, this.z + 600)
        fill(0)
        sphere(5)
        pop()
    }
}