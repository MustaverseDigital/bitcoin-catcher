import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    async create ()
    {
        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(512, 970, 'background').setScale(2.6);

        const logo = this.add.image(450, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 1000,
            duration: 1000,
            ease: 'Bounce'
        });

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        const instructions = [
            'How many coins can you',
            'click in 10 seconds?',
            '',
            'Click to Start!'
        ]

        this.add.text(450, 1300, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('ClickerGame');

        });
    }
}

// add the connect button to the scene
// all options described in the related section
