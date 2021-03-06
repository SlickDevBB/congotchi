// aarc-icon.ts - these are the action icons around a gotchi

import { BLACK_CIRCLE_SHADED, WHITE_CIRCLE_SHADED } from 'game/assets';
import { DEPTH_PLAYER_ICONS, DEPTH_PLAYER_ICON_IMAGES } from 'game/helpers/constants';

interface Props {
    scene: Phaser.Scene;
    x: number;
    y: number;
    keyBg: string;
    keyIcon: string;
    frame?: number;
    radius: number;
    useBadge?: boolean;
    numBadge?: number;
    iconToCircleRatio?: number;
}

const HOVER_SCALE_UP = 1.33;
const ALPHA = 1;

export class AarcIcon extends Phaser.GameObjects.Image {
    // declare private variables
    private icon?: Phaser.GameObjects.Image;
    private selected = false;
    private initRadius = 0;
    private initHeight = 0;
    private initWidth = 0;
    // private badgeBG?: Phaser.GameObjects.Arc | 0;
    private badgeText: Phaser.GameObjects.Text | 0;
    private iconToCircleRatio;
    private badgeOffset = 0;

    constructor({ scene, x, y, keyBg, keyIcon, frame, radius, useBadge = false, numBadge = 0, iconToCircleRatio = 0.8} : Props) {
        super(scene, x, y, keyBg, frame);
        
        // save the initial specified radius for later
        this.initRadius = radius;

        // set icon to circle ratio
        this.iconToCircleRatio = iconToCircleRatio;

        // set depth, alpha and display size
        this.setAlpha(ALPHA);
        this.setAlpha(1);
        this.setDisplaySize(2.5*radius, 2.5*radius);

        // add the icon itself to the scene
        this.scene.add.existing(this);

        // get the very first width and height
        this.initHeight = this.displayHeight;
        this.initWidth = this.displayWidth;

        // now create our icon image
        if (keyIcon !== "") {
            this.icon = this.scene.add.image(x, y, keyIcon);
            this.icon.displayHeight = 2*radius*this.iconToCircleRatio;
            this.icon.displayWidth = this.icon.displayHeight * (this.initWidth/this.initHeight);
            this.icon.setDepth(DEPTH_PLAYER_ICON_IMAGES+100);
            this.icon.setAlpha(1);
            this.icon.setScrollFactor(0);
        }

        // this.badgeBG = this.scene.add.circle(
        //     this.x + radius*this.badgeOffset,
        //     this.y + radius*this.badgeOffset,
        //     radius*1.05,
        //     0x000000,
        //     1)
        //     .setOrigin(0.5,0.5)
        //     .setDepth(DEPTH_PLAYER_ICON_IMAGES+1)

        // add a badge if set to true in constructor
        if (useBadge) {
            this.badgeText = this.scene.add.text(this.x, this.y, numBadge.toString())
                .setOrigin(0.5,0.5)
                .setDepth(DEPTH_PLAYER_ICON_IMAGES+2)
                .setAlpha(1)
                .setStyle({
                    fontSize: (radius*1.1).toString() + 'px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                })
                .setScrollFactor(0);
            this.badgeText.setStroke('#000000', radius*0.25);
        } else {
            // this.badgeBG = 0;
            this.badgeText = 0;
        }

        // call setposition and set visible just in case
        this.setPosition(x, y);
        this.setVisible(true);
        this.setDepth(DEPTH_PLAYER_ICONS);

    }

    public setVisible(value: boolean): this {
        super.setVisible(value);
        if (this.icon) this.icon.setVisible(value);
        // if (this.badgeBG) this.badgeBG.setVisible(value);
        if (this.badgeText) this.badgeText.setVisible(value);
        return this;
    }

    public setAlpha(value: number): this {
        super.setAlpha(value);
        if (this.icon) this.icon.setAlpha(value);
        // if (this.badgeBG) this.badgeBG.setVisible(value);
        if (this.badgeText) this.badgeText.setAlpha(value);
        return this;
    }

    public setLooksEnabled(looksEnabled: boolean) {
        if (looksEnabled) {
            this.setAlpha(ALPHA);
            if (this.icon) this.icon.setAlpha(1);
            // if (this.badgeBG) this.badgeBG.setAlpha(ALPHA);
            if (this.badgeText) this.badgeText.setAlpha(1);
        } else {
            this.setAlpha(ALPHA*0.35);
            if (this.icon) this.icon.setAlpha(0.35);
            // if (this.badgeBG) this.badgeBG.setAlpha(ALPHA*0.35);
            if (this.badgeText) this.badgeText.setAlpha(0.35);
        }
    }

    public setSelected = (selected: boolean) => {
        this.selected = selected;

        // if selected, change bg
        if (selected) {
            this.setTexture(WHITE_CIRCLE_SHADED);
            if (this.icon) {
                this.icon.displayHeight = 2*this.initRadius*this.iconToCircleRatio*HOVER_SCALE_UP;
                this.icon.displayWidth = this.icon.displayHeight * (this.initWidth/this.initHeight);
            }
            this.setDisplaySize(2*this.initRadius*HOVER_SCALE_UP,2*this.initRadius*HOVER_SCALE_UP);
        } else {
            this.setTexture(BLACK_CIRCLE_SHADED);
            if (this.icon) {
                this.icon.displayHeight = 2*this.initRadius*this.iconToCircleRatio;
                this.icon.displayWidth = this.icon.displayHeight * (this.initWidth/this.initHeight);
            }
            this.setDisplaySize(2*this.initRadius, 2*this.initRadius);
        }  
    }

    public isSelected = () => { return this.selected; }

    public setHovered(hovered: boolean) {
        if (hovered) {
            if (this.icon) {
                this.icon.displayHeight = 2*this.initRadius*this.iconToCircleRatio*HOVER_SCALE_UP;
                this.icon.displayWidth = this.icon.displayHeight * (this.initWidth/this.initHeight);
            }
            this.setDisplaySize(2*this.initRadius*HOVER_SCALE_UP,2*this.initRadius*HOVER_SCALE_UP);
        } else {
            if (this.icon) {
                this.icon.displayHeight = 2*this.initRadius*this.iconToCircleRatio;
                this.icon.displayWidth = this.icon.displayHeight * (this.initWidth/this.initHeight);
            }
            this.setDisplaySize(2*this.initRadius,2*this.initRadius);
        }
    }

    public setPosition(x: number, y: number) {
        super.setPosition(x,y);
        if (this.icon) this.icon.setPosition(x,y);
        // if (this.badgeBG) this.badgeBG.setPosition(x+this.initRadius*this.badgeOffset,y+this.initRadius*this.badgeOffset);
        if (this.badgeText) this.badgeText.setPosition(x+this.initRadius*this.badgeOffset,y+this.initRadius*this.badgeOffset);
        return this;
    }

    // define function to change badge number
    public setBadge(value: number) {
        if (this.badgeText) { 
            this.badgeText.text = Math.trunc(value).toString()
            
            // // show a quick red tween to indicate the badge text has changed
            // const delta = { t: 0 }
            // this.scene.add.tween({
            //     targets: delta,
            //     duration: 1000,
            //     t: 1,
            //     onUpdate: () => {
            //         if (this.badgeText) {
            //             this.badgeText.setColor(this.lerpColor("#ff0000", "#ffffff", delta.t));
            //         }
            //     }
            // })
        }
    }

    private lerpColor(aStr: string, bStr: string, amount: number): string {
        
        const a = parseInt(aStr.substring(1), 16);
        const b = parseInt(bStr.substring(1), 16);
        
        const ar = a >> 16,
              ag = a >> 8 & 0xff,
              ab = a & 0xff,
    
              br = b >> 16,
              bg = b >> 8 & 0xff,
              bb = b & 0xff,
    
              rr = ar + amount * (br - ar),
              rg = ag + amount * (bg - ag),
              rb = ab + amount * (bb - ab);
    
        const interp = (rr << 16) + (rg << 8) + (rb | 0);
        return "#" + interp.toString(16);
    }

    public setDepth(depth: number) {
        super.setDepth(depth);
        if (this.icon) this.icon.setDepth(depth+5);
        // if (this.badgeBG) this.badgeBG.setDepth(depth+2);
        if (this.badgeText) this.badgeText.setDepth(depth+3);
        return this;
    }

}