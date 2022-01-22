// go-gotchi.ts - gotchi class

import { GO_Props, GridObject, GridLevel } from 'game/objects';
import { ARROW_ICON, PARTICLE_CONFETTI, SOUND_BELL, SOUND_POP } from 'game/assets';
import { GameScene } from 'game/scenes/game-scene';
import { DEPTH_GOTCHI_ICON, DEPTH_GO_GOTCHI, DEPTH_GO_GOTCHI_BLOCK } from 'game/helpers/constants';
import { getGameHeight } from 'game/helpers';
import { GO_Cactii } from './go-cactii';

export interface GO_Gotchi_Props extends GO_Props {
    direction: 'DOWN' | 'LEFT' | 'UP' | 'RIGHT';
}
  
export class GO_Gotchi extends GridObject {
    private direction: 'DOWN' | 'LEFT' | 'UP' | 'RIGHT' = 'DOWN';
    private leader: GridObject | 0 = 0;
    private followers: Array<GridObject | 0> = [0, 0, 0, 0]; // element 0 is down, 1 is left, 2 is up, 3 is right
    // private gotchi: AavegotchiGameObject;

    // create arrows which are used to depict direction changes
    private arrows: Array<Phaser.GameObjects.Image> = [];

    private spiked = false;

    // declare variable for setting visibility of rotate arrows
    private rotateArrowsVisible = false;
    private overArrows = false;
    private overGotchi = false;

    // store the active pointer
    private mousePointer: Phaser.Input.Pointer;

    // need a little circle to use as a direction guide
    private directionGuide: Phaser.GameObjects.Ellipse;
    private directionLine: Phaser.GameObjects.Line;

    // conga side is a variable for tracking which side we conga on
    private congaSide: 'LEFT' | 'RIGHT' = 'LEFT';

    // duration variable for conga steps
    private congaStepDuration = 60/140*1000;

    // timer is for click events
    private timer = 0;

    // define variables for dragging object
    private ogDragGridPosition = { row: 0, col: 0 };
    private ogX = 0;
    private ogY = 0;

    // define public variables for conga
    public newRow = 0;
    public newCol = 0;
    public newDir: 'DOWN' | 'LEFT' | 'UP' | 'RIGHT' = 'DOWN';
    public status: 'READY_TO_CONGA' | 'READY_TO_JUMP' | 'CONGOTCHING' | 'JUMPING' | 'FINISHED_CONGA' | 'WAITING' | 'BURNT' | 'TELEPORTING' = 'WAITING';

    // this multiplier should be changed by rofl's
    protected teleportScoreMultiplier = 1;

    // add sound effects
    private soundMove?: Phaser.Sound.HTML5AudioSound;
    private soundInteract?: Phaser.Sound.HTML5AudioSound;
    private soundBell?: Phaser.Sound.HTML5AudioSound;

    // create particle effects
    private particleConfetti?: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private emitterConfetti?: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor({ scene, gridLevel, gridRow, gridCol, key, gridSize, objectType = 'GOTCHI', direction = 'DOWN' }: GO_Gotchi_Props) {//gotchi, gridSize, objectType }: GO_Gotchi_Props) {
        super({scene, gridLevel, gridRow, gridCol, key, gridSize, objectType});

        // set our block sprite size
        this.blockSprite?.setDisplaySize(this.gridSize*0.7, this.gridSize*0.7);

        // Set our direcction
        this.direction = direction;

        // add sound
        this.soundMove = this.scene.sound.add(SOUND_POP, { loop: false }) as Phaser.Sound.HTML5AudioSound;
        this.soundInteract = this.scene.sound.add(SOUND_POP, { loop: false }) as Phaser.Sound.HTML5AudioSound;
        this.soundBell = this.scene.sound.add(SOUND_BELL, { loop: false }) as Phaser.Sound.HTML5AudioSound;
        this.soundBell.setVolume(0.5);

        // add particle manager
        this.particleConfetti = this.scene.add.particles(PARTICLE_CONFETTI);
        this.particleConfetti.setDepth(this.depth + 10);

        // create emitter with some slightly randomized attributes for each gotchi
        const angleRand = (Math.random()-0.5)*10;
        const speedRand = (Math.random()-0.5)*50;
        const lifespanRand = (Math.random()-0.5)*100;
        const quantityRand = Math.floor((Math.random()-0.5)*5);

        // add particle emitter
        this.emitterConfetti = this.particleConfetti.createEmitter({
            frame: [ 'red', 'blue', 'green', 'yellow' ],
            x: this.x,
            y: this.y,
            angle: { min: -100+angleRand, max: -80+angleRand },
            gravityY: 2000,
            speed: 500+speedRand,
            lifespan: 750+lifespanRand,
            quantity: 15+quantityRand,
            scale: { start: 0.1, end: 0 },
            blendMode: 'COPY'
        })
        .setScrollFactor(0)
        .stop();

        // save the mouse
        this.mousePointer = this.scene.input.activePointer;

        this.on('pointerover', () => {
            console.log('My status: ' + this.status);
        })

        // create down arrow
        this.arrows.push(
            this.scene.add.image(this.x, this.y+this.gridSize, ARROW_ICON)
            .setAngle(0)
            .on('pointerup', () => {
                // check we've got actions remaining and not already facing down, if so face down
                if (this.gridLevel.getActionsRemaining() > 0 && this.getDirection() !== 'DOWN') {
                    // aim down
                    this.setDirection('DOWN');
                    
                    // reduce actions remaining
                    this.gridLevel.adjustActionsRemaining(-1);

                    // in case we were burnt change status back to 'WAITING'
                    this.status = 'WAITING';

                    // play the interact sound
                    this.soundInteract?.play();

                    // hide arrows
                    this.setRotateArrowsVisible(false);
                }
            })
        );

        // create left arrow
        this.arrows.push(
            this.scene.add.image(this.x-this.gridSize, this.y, ARROW_ICON)
            .setAngle(90)
            .on('pointerup', () => {
                // check we've got enough interaction points
                if (this.gridLevel.getActionsRemaining() > 0 && this.getDirection() !== 'LEFT') {
                    // aim left
                    this.setDirection('LEFT');
                    
                    // reduce actions remaining
                    this.gridLevel.adjustActionsRemaining(-1);

                    // in case we were burnt change status back to 'WAITING'
                    this.status = 'WAITING';

                    // play the interact sound
                    this.soundInteract?.play();

                    // hide arrows
                    this.setRotateArrowsVisible(false);
                }
            })
        );

        // create up arrow
        this.arrows.push(
            this.scene.add.image(this.x, this.y-this.gridSize, ARROW_ICON)
            .setAngle(180)
            .on('pointerup', () => {
                // check we've got enough interaction points
                if (this.gridLevel.getActionsRemaining() > 0 && this.getDirection() !== 'UP') {
                    // aim up
                    this.setDirection('UP');
                    
                    // reduce actions remaining
                    this.gridLevel.adjustActionsRemaining(-1);

                    // in case we were burnt change status back to 'WAITING'
                    this.status = 'WAITING';

                    // play the interact sound
                    this.soundInteract?.play();

                    // hide arrows
                    this.setRotateArrowsVisible(false);
                }
            })
        );

        // create right arrow
        this.arrows.push(
            this.scene.add.image(this.x+this.gridSize, this.y, ARROW_ICON)    
            .setAngle(-90)
            .on('pointerup', () => {
                // check we've got enough interaction points
                if (this.gridLevel.getActionsRemaining() > 0 && this.getDirection() !== 'RIGHT') {
                    // aim right
                    this.setDirection('RIGHT');
                    
                    // reduce actions remaining
                    this.gridLevel.adjustActionsRemaining(-1);

                    // in case we were burnt change status back to 'WAITING'
                    this.status = 'WAITING';

                    // play the interact sound
                    this.soundInteract?.play();

                    // hide arrows
                    this.setRotateArrowsVisible(false);
                }
            })    
        );

        // set some standard arrow values
        this.arrows.map(arrow => {
            arrow.setDisplaySize(this.gridSize, this.gridSize)
            .setDepth(DEPTH_GOTCHI_ICON)
            .setAlpha(0.75)
            .setScrollFactor(0)
            .setVisible(false)
            .setInteractive()
            .on('pointerover', () => this.overArrows = true)
            .on('pointerout', () => this.overArrows = false)
        })

        // create our direction guide
        this.directionGuide = this.scene.add.ellipse(this.x, this.y,
            this.displayWidth*0.12, this.displayWidth*0.12, 0xff00ff)
            .setDepth(this.depth+1)
            .setAlpha(0.9)
            .setScrollFactor(0);

        // create our direction line
        this.directionLine = this.scene.add.line(
            0, 
            0,
            0,
            0,
            0,
            0,
            0xff00ff)
            .setDepth(this.depth+1)
            .setAlpha(0.9)
            .setScrollFactor(0);

        // set behaviour for pointer click down
        this.on('pointerdown', () => {
            // get the time at which we clicked
            this.timer = new Date().getTime();
        });

        // set behaviour for pointer up event
        this.on('pointerup', () => {
            // See if we're close to a pointer down event (i.e. a single click occurred)
            const delta = new Date().getTime() - this.timer;
            if (delta < 200) {
                // check we've got enough interact points
                if (this.gridLevel.getActionsRemaining() > 0) {
                    // store the grid position pointer was lefted in finished in
                    const finalGridPos = this.gridLevel.getGridPositionFromXY(this.x, this.y);

                    // show arrows only if we're still in the same grid as when the pointer went down
                    if (finalGridPos.row === this.ogDragGridPosition.row && finalGridPos.col === this.ogDragGridPosition.col) {
                        // we have enough interact points so toggle visible arrow status
                        this.rotateArrowsVisible = !this.rotateArrowsVisible;
                    }
                }
            }
        });

        // set behaviour when over gotchi
        this.on('pointerover', () => { this.overGotchi = true;})
        this.on('pointerout', () => { this.overGotchi = false;})

        // dragstart
        this.on('dragstart', () => {
            // store our initial drag positions
            this.ogDragGridPosition = this.getGridPosition();
            this.ogX = this.x;
            this.ogY = this.y;
        })

        // set behaviour for dragging
        this.on('drag', (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            // if we've got movement points left we can drag
            if (this.gridLevel.getActionsRemaining() > 0) {
                // only drag objects into grids they have space for
                const gp = this.getGridPosition();
                const aboveEmpty = gp.row > 0 && this.gridLevel.isGridPositionEmpty(gp.row-1, gp.col);
                const belowEmpty = gp.row < this.gridLevel.getNumberRows()-1 && this.gridLevel.isGridPositionEmpty(gp.row+1, gp.col);
                const leftEmpty = gp.col > 0 && this.gridLevel.isGridPositionEmpty(gp.row, gp.col-1);
                const rightEmpty = gp.col < this.gridLevel.getNumberCols()-1 && this.gridLevel.isGridPositionEmpty(gp.row, gp.col+1);
                
                const upLimit = aboveEmpty ? this.ogY - this.gridLevel.getGridSize() : this.ogY;
                const downLimit = belowEmpty ? this.ogY + this.gridLevel.getGridSize() : this.ogY;
                const leftLimit = leftEmpty ? this.ogX - this.gridLevel.getGridSize() : this.ogX;
                const rightLimit = rightEmpty ? this.ogX + this.gridLevel.getGridSize() : this.ogX;

                // find out if we're further from original X or Y
                const deltaX = this.ogX - dragX;
                const deltaY = this.ogY - dragY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (dragX > leftLimit && dragX < rightLimit) this.x = dragX;
                    this.y = this.ogY;
                } else {
                    if (dragY > upLimit && dragY < downLimit) this.y = dragY;
                    this.x = this.ogX;
                }
            }    
        });

        this.on('dragend', () => {
            // store the grid position dragging finished in
            const finalGridPos = this.gridLevel.getGridPositionFromXY(this.x, this.y);
            this.setGridPosition(finalGridPos.row, finalGridPos.col, () => {
                // adjust the player stat if we're in different grid position from start of drag
                if (!(finalGridPos.row === this.ogDragGridPosition.row && finalGridPos.col === this.ogDragGridPosition.col)) {
                    // reduce actions remaining
                    this.gridLevel.adjustActionsRemaining(-1);

                    // in case we were burnt change status back to 'WAITING'
                    this.status = 'WAITING';

                    // play the move sound
                    this.soundMove?.play();
                }
            });
        })

        

    }

    public setGotchiSprite(key: string) {
        // set our block texture
        this.blockSprite?.setTexture(key);

        // set depths a bit different
        const currentDepth = this.depth;
        this.setDepth(currentDepth - 1);
        this.blockSprite?.setDepth(currentDepth + 2);

        // // Add animations if we're a gotchi (and not a rofl)
        if (this.objectType === 'GOTCHI') {
            this.blockSprite?.anims.create({
                key: 'down',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 0, end: 0 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'left',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 2, end: 2 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'right',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 4, end: 4 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'up',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 6, end: 6 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'down_happy',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 8, end: 8 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'left_happy',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 10, end: 10 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'right_happy',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 12, end: 12 }),
                frameRate: 2,
                repeat: -1,
            });
            this.blockSprite?.anims.create({
                key: 'up_happy',
                frames: this.blockSprite?.anims.generateFrameNumbers(key || '', { start: 14, end: 14 }),
                frameRate: 2,
                repeat: -1,
            });

            this.blockSprite?.anims.play('down');
        }

        // set our direction
        this.setDirection(this.direction);
    }

    // a function to see if there is a certain status up the chain
    public isUpchainStatus(status: 'READY_TO_CONGA' | 'READY_TO_JUMP' | 'CONGOTCHING' | 'JUMPING' | 'FINISHED_CONGA' | 'WAITING' | 'BURNT' | 'TELEPORTING'): boolean {
        const leader = this.leader as GO_Gotchi;
        if (leader) {
            if (leader.status === status) {
                return true;
            } else {
                return leader.isUpchainStatus(status);
            }
        } else {
            return false;
        }
    }

    public findLeader() {
        // start by setting leader to 0
        this.leader = 0;

        // go to the cell our gotchi is facing and see if there's a gotchi in it
        let potentialLeader;
        switch (this.getDirection()) {
            case 'DOWN': potentialLeader = this.gridLevel.getGridObject(this.gridPosition.row+1, this.gridPosition.col); break;
            case 'LEFT': potentialLeader = this.gridLevel.getGridObject(this.gridPosition.row, this.gridPosition.col-1); break;
            case 'UP': potentialLeader = this.gridLevel.getGridObject(this.gridPosition.row-1, this.gridPosition.col); break;
            case 'RIGHT': potentialLeader = this.gridLevel.getGridObject(this.gridPosition.row, this.gridPosition.col+1); break;
            default: break;
        }

        // double check the grid object we found is a gotchi or rofl
        if (potentialLeader !== 'OUT OF BOUNDS' && (potentialLeader?.getType() === 'GOTCHI' || potentialLeader?.getType() === 'ROFL') && (potentialLeader as GO_Gotchi).status !== 'BURNT') {
            // check the gotchi/rofl isn't looking straight back at us
            let lookingAtUs = false;
            switch (this.getDirection()) {
                case 'DOWN': if ( (potentialLeader as GO_Gotchi).getDirection() === 'UP') lookingAtUs = true; break;
                case 'LEFT': if ( (potentialLeader as GO_Gotchi).getDirection() === 'RIGHT') lookingAtUs = true; break;
                case 'UP': if ( (potentialLeader as GO_Gotchi).getDirection() === 'DOWN') lookingAtUs = true; break;
                case 'RIGHT': if ( (potentialLeader as GO_Gotchi).getDirection() === 'LEFT') lookingAtUs = true; break;
                default: break;
            }
            if (!lookingAtUs) this.setLeader(potentialLeader as GO_Gotchi);
            else this.setLeader(0);
        } else {
            this.setLeader(0);
        }
    }

    public findFollowers() {
        // check each direction to see if there is a gotchi looking at us
        const downGotchi = this.gridLevel.getGridObject(this.gridPosition.row+1, this.gridPosition.col);
        if (downGotchi !== 'OUT OF BOUNDS' &&
            (downGotchi.getType() === 'GOTCHI' || downGotchi.getType() === 'ROFL') &&
            (downGotchi as GO_Gotchi).getDirection() === 'UP') {
                this.followers[0] = downGotchi;
        } else this.followers[0] = 0;

        const leftGotchi = this.gridLevel.getGridObject(this.gridPosition.row, this.gridPosition.col-1);
        if (leftGotchi !== 'OUT OF BOUNDS' &&
            (leftGotchi.getType() === 'GOTCHI' || leftGotchi.getType() === 'ROFL') &&
            (leftGotchi as GO_Gotchi).getDirection() === 'RIGHT') {
                this.followers[1] = leftGotchi;
        } else this.followers[1] = 0;

        const upGotchi = this.gridLevel.getGridObject(this.gridPosition.row-1, this.gridPosition.col);
        if (upGotchi !== 'OUT OF BOUNDS' &&
            (upGotchi.getType() === 'GOTCHI' || upGotchi.getType() === 'ROFL') &&
            (upGotchi as GO_Gotchi).getDirection() === 'DOWN') {
                this.followers[2] = upGotchi;
        } else this.followers[2] = 0;

        const rightGotchi = this.gridLevel.getGridObject(this.gridPosition.row, this.gridPosition.col+1);
        if (rightGotchi !== 'OUT OF BOUNDS' &&
            (rightGotchi.getType() === 'GOTCHI' || rightGotchi.getType() === 'ROFL') &&
            (rightGotchi as GO_Gotchi).getDirection() === 'LEFT') {
                this.followers[3] = rightGotchi;
        } else this.followers[3] = 0; 
    }

    public setLeader(leader: GO_Gotchi | 0) {
        this.leader = leader;
        return this;
    }

    public getLeader() {
        return this.leader;
    }

    public hasLeader() {
        if (this.leader) return true;
        else return false;
    }

    public getFollowers() {
        return this.followers;
    }

    public hasFollower() {
        let haveFollower = false;
        this.followers.map( follower => { if (follower) haveFollower = true; });
        return haveFollower;
    }

    public getDirection() {
        return this.direction;
    }

    public setDirection(direction: 'DOWN' | 'LEFT' | 'RIGHT' | 'UP') {
        this.direction = direction;
        // check we're not a rofl
        if (this.objectType === 'GOTCHI') {
            switch (direction) {
                case 'DOWN': {
                    this.blockSprite?.anims.play('down');
                    break;
                }
                case 'LEFT': {
                    this.blockSprite?.anims.play('left');
                    break;
                }
                case 'RIGHT': {
                    this.blockSprite?.anims.play('right');
                    break;
                }
                case 'UP': {
                    this.blockSprite?.anims.play('up');
                    break;
                }
                default: {
                    
                    break;
                }
            }
        }
        return this;
    }

    public setRotateArrowsVisible(visible: boolean) {
        this.arrows.map(arrow => arrow.setVisible(visible));
        this.rotateArrowsVisible = visible;
    }

    public setRandomDirection() {
        const rand = Math.floor(Math.random()*4);
        if (rand === 0) this.setDirection('DOWN');
        else if (rand === 1) this.setDirection('LEFT');
        else if (rand === 2) this.setDirection('RIGHT');
        else this.setDirection('UP');
        return this;
    }

    public congaIntoPosition(row: number, col: number, jumpAtEnd: boolean) {
        // update our status
        this.status = 'CONGOTCHING';

        // call our set grid position that moves our gotchi
        this.setGridPosition(
            row,
            col,
            () => {
                this.setDirection(this.newDir);
                if (!jumpAtEnd) {
                    setTimeout( () => {
                        this.status = 'WAITING' 
                    } , this.congaStepDuration*0.5);
                } else {
                    this.congaJump();
                }
            },
            false,
            this.congaStepDuration*0.5,
            'Back.easeOut'
        )

        // add another tween for our gotchi which rotates him a bit to look conga'ish
        this.scene.add.tween({
            targets: this.blockSprite,
            angle: this.congaSide === 'LEFT' ? -20 : 20,
            duration: this.congaStepDuration*0.5,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // change conga side
                this.congaSide = this.congaSide === 'LEFT' ? 'RIGHT' : 'LEFT';
            }
        })

        return this;

    }

    public congaStationary(jumpAtEnd: boolean) {
        // add a tween for our gotchi which rotates him a bit to look conga'ish
        this.scene.add.tween({
            targets: this.blockSprite,
            angle: this.congaSide === 'LEFT' ? -20 : 20,
            duration: this.congaStepDuration*0.5,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // change conga side
                this.congaSide = this.congaSide === 'LEFT' ? 'RIGHT' : 'LEFT';
                if (jumpAtEnd) {
                    this.congaJump();
                }
            }
        })

        return this;
    }

    public congaJump() {
        // change anim to happy
        if (this.objectType === 'GOTCHI') this.blockSprite?.anims.play(this.getDirection().toLowerCase() + '_happy');

        this.emitterConfetti?.start();
        setTimeout( () => {
            this.emitterConfetti?.stop();
        }, 75);

        this.status = 'JUMPING';

        // score some points and animated the stat point
        if (this.player) {
            this.gui?.adjustScoreWithAnim(this.player.getStat('CONGA_JUMP'), this.x, this.y);
            this.player.animStat('CONGA_JUMP');
        }

        // tween a jump
        this.scene.add.tween({
            targets: this,
            y: this.y - this.displayHeight*0.5,
            duration: this.congaStepDuration*0.25,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.scene.add.tween({
                    targets: this,
                    y: this.y + this.displayHeight*0.5,
                    duration: this.congaStepDuration*0.25,
                    ease: 'Quad.easeIn',
                    onComplete: () => { 
                        setTimeout( () => {
                            this.status = 'WAITING';
                        }, this.congaStepDuration );
                    }
                })
            }
        });
        

        // tween gotchi into vertical position
        this.scene.add.tween({
            targets: this,
            angle: 0,
            duration: this.congaStepDuration*0.25,
        })
    }

    public congaIntoPortal(row: number, col: number) {
        // first lets score some points
        if (this.player) {
            // check
            this.gui?.adjustScoreWithAnim(this.player.getStat('GOTCHI_SAVE')*this.teleportScoreMultiplier, this.x, this.y);
            this.player.animStat('GOTCHI_SAVE');
        }

        // Let's get in that portal
        this.setGridPosition(
            row,
            col,
            () => {
                // change status to teleporting
                this.status = 'TELEPORTING';

                // hide our bgBlock
                this.setVisible(false);
                this.blockSprite?.setVisible(true);

                // spiral the gotchi into the portal
                this.scene.add.tween({
                    targets: this.blockSprite,
                    scale: 0,
                    angle: 720,
                    duration: 500,
                    onComplete: () => {
                        this.destroy();
                    }
                });
            },
            true,
            this.congaStepDuration*0.5,
        )

        return this;
    }

    // this function checks if we're adjacent a cactii and if TRUE then we lose pointDelta
    public cactiiSpike(pointDelta: number) {
        // get our gotchis grid position
        const pos = this.gridPosition;

        // check down
        const downCactii = this.gridLevel.getGridObject(pos.row, pos.col+1);
        if (downCactii !== 'OUT OF BOUNDS' && downCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check left
        const leftCactii = this.gridLevel.getGridObject(pos.row-1, pos.col);
        if (leftCactii !== 'OUT OF BOUNDS' && leftCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check up
        const upCactii = this.gridLevel.getGridObject(pos.row, pos.col-1);
        if (upCactii !== 'OUT OF BOUNDS' && upCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check right
        const rightCactii = this.gridLevel.getGridObject(pos.row+1, pos.col);
        if (rightCactii !== 'OUT OF BOUNDS' && rightCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check bottom left
        const downLeftCactii = this.gridLevel.getGridObject(pos.row-1, pos.col+1);
        if (downLeftCactii !== 'OUT OF BOUNDS' && downLeftCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check top left
        const upLeftCactii = this.gridLevel.getGridObject(pos.row-1, pos.col-1);
        if (upLeftCactii !== 'OUT OF BOUNDS' && upLeftCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check top right
        const upRightCactii = this.gridLevel.getGridObject(pos.row+1, pos.col-1);
        if (upRightCactii !== 'OUT OF BOUNDS' && upRightCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // check bottom right
        const downRightCactii = this.gridLevel.getGridObject(pos.row+1, pos.col+1);
        if (downRightCactii !== 'OUT OF BOUNDS' && downRightCactii.getType() === 'CACTII') {
            this.spiked = true;
        }

        // do stuff if we got spiked
        const dt = {t: 0};
        if (this.spiked) {
            // reduce our total score if spiked
            if (this.player) {
                this.gui?.adjustScoreWithAnim(this.player.getStat('RED_DAMAGE'), this.x, this.y);
                this.player.animStat('RED_DAMAGE');
            }

            // show a quick red tween for "damage"
            this.scene.add.tween({
                targets: dt,
                t: 1,
                duration: 250,
                onUpdate: () => {
                    const colour = Phaser.Display.Color.HexStringToColor(this.lerpColor('#ff0000', '#ffffff', dt.t));
                    this.setTint(colour.color);
                },
                onComplete: () => { 
                    this.spiked = false; 
                }
            })
        }
    }

    /**
     * A linear interpolator for hexadecimal colors
     * @param {String} a
     * @param {String} b
     * @param {Number} amount
     * @example
     * // returns #7F7F7F
     * lerpColor('#000000', '#ffffff', 0.5)
     * @returns {String}
     */
    private lerpColor(a: string, b: string, amount: number) { 

        const ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    destroy() {
        super.destroy();
        this.directionGuide.destroy();
        this.directionLine.destroy();
        this.arrows.map(arrow => arrow.destroy());
        this.blockSprite?.destroy();
    }

    public calcCongaChain(gotchiChain: Array<GO_Gotchi>) {
        // call our recursive function
        this.getCongaChain(gotchiChain);
    }

    // get conga chain
    private getCongaChain(gotchiChain: Array<GO_Gotchi>) {
        // for each follower that is a gotchi add them to the chain and call their followers too
        if (this.followers[0] && (this.followers[0] as GO_Gotchi).status !== 'BURNT') {
            // add to the gotchi chain and check the follower for followers
            gotchiChain.push((this.followers[0] as GO_Gotchi));
            (this.followers[0] as GO_Gotchi).getCongaChain(gotchiChain);
        }
        if (this.followers[1] && (this.followers[1] as GO_Gotchi).status !== 'BURNT') {
            // add to the gotchi chain and check the follower for followers
            gotchiChain.push((this.followers[1] as GO_Gotchi));
            (this.followers[1] as GO_Gotchi).getCongaChain(gotchiChain);
        }
        if (this.followers[2] && (this.followers[2] as GO_Gotchi).status !== 'BURNT') {
            // add to the gotchi chain and check the follower for followers
            gotchiChain.push((this.followers[2] as GO_Gotchi));
            (this.followers[2] as GO_Gotchi).getCongaChain(gotchiChain);
        }
        if (this.followers[3] && (this.followers[3] as GO_Gotchi).status !== 'BURNT') {
            // add to the gotchi chain and check the follower for followers
            gotchiChain.push((this.followers[3] as GO_Gotchi));
            (this.followers[3] as GO_Gotchi).getCongaChain(gotchiChain);
        }

    }        

   public getStatus() {
       return this.status;
   }
  
    update(): void {
        super.update(); 

        // update direction guide and line position
        switch (this.getDirection()) {
            case 'DOWN': { 
                this.directionGuide.setPosition(this.x, this.y+this.displayHeight/2); 
                this.directionLine.setTo(this.x, this.y+this.displayHeight/4, this.x, this.y+this.displayHeight/2);
                break; 
            }
            case 'LEFT': { 
                this.directionGuide.setPosition(this.x-this.displayWidth/2, this.y); 
                this.directionLine.setTo(this.x-this.displayWidth/4, this.y, this.x-this.displayWidth/2, this.y);
                break; 
            }
            case 'UP': { 
                this.directionGuide.setPosition(this.x, this.y-this.displayHeight/2); 
                this.directionLine.setTo(this.x, this.y-this.displayHeight/4, this.x, this.y-this.displayHeight/2);
                break; 
            }
            case 'RIGHT': { 
                this.directionGuide.setPosition(this.x+this.displayWidth/2, this.y); 
                this.directionLine.setTo(this.x+this.displayWidth/4, this.y, this.x+this.displayWidth/2, this.y);
                break; 
            }
        }

        // make sure rotate arrows follow their gotchi
        if (this.arrows.length === 4) {
            this.arrows[0].setPosition(this.x, this.y+this.gridSize);
            this.arrows[1].setPosition(this.x-this.gridSize, this.y);
            this.arrows[2].setPosition(this.x, this.y-this.gridSize);
            this.arrows[3].setPosition(this.x+this.gridSize, this.y);
        }

        // make sure particles follow our grid object
        this.emitterConfetti?.setPosition(this.x, this.y);

        // update visibility of all arrows
        this.arrows.map(arrow => {
            arrow.setVisible(this.rotateArrowsVisible);
        })

        // if there is a click hide the arrows of the gotchi
        if (this.mousePointer.isDown && !this.overArrows && !this.overGotchi) {
            this.rotateArrowsVisible = false;
        }

        // if the gotchi has burnt status set tint to grey/black
        if (this.status === 'BURNT') {
            this.blockSprite?.setTint(0x444444);
        } else if (!this.spiked) {
            this.blockSprite?.setTint(0xffffff);
        }
    }
}
  