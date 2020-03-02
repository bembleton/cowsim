/*
SCREEN
256x240


4 pixels per byte
[7,6,5,4,3,2,1,0]
00: transparent
01: color1
10: color2
11: color3

8x8 sprite = 16 bytes

SpriteSheet
256 sprites = 4096 bytes

drawSprite(spriteIndex, spriteFlags, x, y)

Tile
8x8         = 16 bytes

TileSheet
256 tiles   = 4096 bytes

MetaTile
4 tiles     = 4 bytes

MetaTileSheet
128         = 512 bytes

Sprite Flags
10 xx xxxx: flipx  
01 xx xxxx: flipy
xx 00 xxxx: palette1
xx 01 xxxx: palette2
xx 10 xxxx: palette3
xx 11 xxxx: palette4

Sprite
index,x,y,flags


------XX  palette
1-------  flipy
-1------  flipx
--1-----  priority

*/
0       0x00
64      0x40
128     0x80
192     0xC0
const sprite = {
    draw: function () {

    }
}

export default sprite;